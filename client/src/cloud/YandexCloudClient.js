import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

// Browser-compatible path utilities
const pathUtils = {
  extname: function(fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? '.' + parts.pop().toLowerCase() : '';
  }
};

class YandexCloudClient {
  constructor(config) {
    this.bucket = config.bucket;
    this.endpoint = config.endpoint || 'https://storage.yandexcloud.net';
    this.region = config.region || 'ru-central1';
    
    // Configure AWS SDK for Yandex Cloud
    this.s3 = new AWS.S3({
      endpoint: this.endpoint,
      region: this.region,
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      signatureVersion: 'v4'
    });
  }

  /**
   * Upload encrypted message file to cloud
   * @param {string} recipientId - Recipient's user ID
   * @param {object} messagePackage - Encrypted message package
   * @returns {Promise<string>} Uploaded file key
   */
  async uploadMessage(recipientId, messagePackage) {
    const messageId = uuidv4();
    const timestamp = Date.now();
    const key = `messages/${recipientId}/${timestamp}_${messageId}.enc`;
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: JSON.stringify(messagePackage),
      ContentType: 'application/json',
      Metadata: {
        senderId: messagePackage.senderId,
        timestamp: messagePackage.timestamp.toString()
      }
    };
    
    console.log('Uploading message with params:', { bucket: this.bucket, key });
    
    try {
      await this.s3.putObject(params).promise();
      console.log(`Message uploaded: ${key}`);
      return key;
    } catch (error) {
      console.error('Error uploading message:', error);
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode
      });
      throw error;
    }
  }

  /**
   * Download and decrypt messages for user
   * @param {string} userId - User's ID
   * @param {number} since - Timestamp to fetch messages since
   * @returns {Promise<Array>} Array of message packages
   */
  async downloadMessages(userId, since = 0) {
    const prefix = `messages/${userId}/`;
    
    const params = {
      Bucket: this.bucket,
      Prefix: prefix
    };
    
    try {
      const data = await this.s3.listObjectsV2(params).promise();
      
      const messages = [];
      for (const obj of data.Contents || []) {
        // Extract timestamp from key
        const keyParts = obj.Key.split('/');
        const fileName = keyParts[keyParts.length - 1];
        const fileTimestamp = parseInt(fileName.split('_')[0]);
        
        // Skip old messages
        if (fileTimestamp <= since) continue;
        
        // Download message
        const messagePackage = await this.downloadFile(obj.Key);
        messages.push(messagePackage);
      }
      
      return messages.sort((a, b) => a.timestamp - b.timestamp);
    } catch (error) {
      console.error('Error downloading messages:', error);
      throw error;
    }
  }

  /**
   * Download a single file from cloud
   * @param {string} key - File key in bucket
   * @returns {Promise<any>} File content parsed as JSON
   */
  async downloadFile(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };
    
    try {
      const data = await this.s3.getObject(params).promise();
      const content = data.Body.toString('utf8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error downloading file ${key}:`, error);
      throw error;
    }
  }

  /**
   * Upload file attachment
   * @param {string} userId - Owner's user ID
   * @param {Buffer} fileData - File binary data
   * @param {string} fileName - Original file name
   * @returns {Promise<string>} File key
   */
  async uploadAttachment(userId, fileData, fileName) {
    const fileId = uuidv4();
    const timestamp = Date.now();
    const ext = pathUtils.extname(fileName);
    const key = `attachments/${userId}/${timestamp}_${fileId}${ext}`;
    
    const params = {
      Bucket: this.bucket,
      Key: key,
      Body: fileData,
      ContentType: this.getContentType(fileName)
    };
    
    try {
      await this.s3.putObject(params).promise();
      console.log(`Attachment uploaded: ${key}`);
      return key;
    } catch (error) {
      console.error('Error uploading attachment:', error);
      throw error;
    }
  }

  /**
   * Download file attachment
   * @param {string} key - File key in bucket
   * @returns {Promise<Buffer>} File binary data
   */
  async downloadAttachment(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };
    
    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body;
    } catch (error) {
      console.error(`Error downloading attachment ${key}:`, error);
      throw error;
    }
  }

  /**
   * Delete message file
   * @param {string} key - File key to delete
   * @returns {Promise<void>}
   */
  async deleteFile(key) {
    const params = {
      Bucket: this.bucket,
      Key: key
    };
    
    try {
      await this.s3.deleteObject(params).promise();
      console.log(`File deleted: ${key}`);
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }

  /**
   * Check if bucket exists and is accessible
   * @returns {Promise<boolean>}
   */
  async checkConnection() {
    try {
      await this.s3.headBucket({ Bucket: this.bucket }).promise();
      return true;
    } catch (error) {
      console.error('Cannot access bucket:', error.message);
      return false;
    }
  }

  /**
   * Get content type based on file extension
   * @param {string} fileName - File name
   * @returns {string} MIME type
   */
  getContentType(fileName) {
    const ext = pathUtils.extname(fileName);
    const mimeTypes = {
      '.txt': 'text/plain',
      '.pdf': 'application/pdf',
      '.doc': 'application/msword',
      '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.zip': 'application/zip',
      '.json': 'application/json'
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * List all files in user's folder
   * @param {string} userId - User ID
   * @param {string} type - 'messages' or 'attachments'
   * @returns {Promise<Array>} List of file keys
   */
  async listUserFiles(userId, type = 'messages') {
    const prefix = `${type}/${userId}/`;
    
    const params = {
      Bucket: this.bucket,
      Prefix: prefix
    };
    
    try {
      const data = await this.s3.listObjectsV2(params).promise();
      return data.Contents.map(obj => obj.Key);
    } catch (error) {
      console.error('Error listing files:', error);
      throw error;
    }
  }
}

export default YandexCloudClient;
