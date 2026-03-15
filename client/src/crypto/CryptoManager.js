import forge from 'node-forge';

class CryptoManager {
  constructor() {
    this.rsa = forge.pki.rsa;
  }

  /**
   * Generate RSA key pair
   * @param {number} bits - Key size (default 2048)
   * @returns {{publicKey: string, privateKey: string}} PEM formatted keys
   */
  generateRSAKeyPair(bits = 2048) {
    const keypair = forge.pki.rsa.generateKeyPair(bits);
    
    const publicKeyPem = forge.pki.publicKeyToPem(keypair.publicKey);
    const privateKeyPem = forge.pki.privateKeyToPem(keypair.privateKey);
    
    return {
      publicKey: publicKeyPem,
      privateKey: privateKeyPem
    };
  }

  /**
   * Encrypt data with AES-256-CBC
   * @param {string|Buffer} data - Data to encrypt
   * @param {string} aesKey - 32-byte hex string AES key
   * @returns {{iv: string, encrypted: string}} IV and encrypted data as hex strings
   */
  encryptAES(data, aesKey) {
    const iv = forge.random.getBytesSync(16);
    const cipher = forge.cipher.createCipher('AES-CBC', forge.util.hexToBytes(aesKey));
    cipher.start({ iv: iv });
    
    const dataBytes = typeof data === 'string' 
      ? forge.util.encodeUtf8(data) 
      : data.toString('binary');
    
    cipher.update(forge.util.createBuffer(dataBytes));
    cipher.finish();
    
    const encrypted = cipher.output.getBytes();
    
    return {
      iv: forge.util.bytesToHex(iv),
      encrypted: forge.util.bytesToHex(encrypted)
    };
  }

  /**
   * Decrypt data with AES-256-CBC
   * @param {string} encrypted - Encrypted data as hex string
   * @param {string} aesKey - 32-byte hex string AES key
   * @param {string} iv - IV as hex string
   * @returns {string} Decrypted data
   */
  decryptAES(encrypted, aesKey, iv) {
    const decipher = forge.cipher.createDecipher('AES-CBC', forge.util.hexToBytes(aesKey));
    decipher.start({ iv: forge.util.hexToBytes(iv) });
    
    const encryptedBuffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));
    decipher.update(encryptedBuffer);
    decipher.finish();
    
    return forge.util.decodeUtf8(decipher.output.getBytes());
  }

  /**
   * Generate random AES-256 key
   * @returns {string} 32-byte hex string
   */
  generateAESKey() {
    const key = forge.random.getBytesSync(32);
    return forge.util.bytesToHex(key);
  }

  /**
   * Encrypt data with RSA public key
   * @param {string} data - Data to encrypt
   * @param {string} publicKeyPem - RSA public key in PEM format
   * @returns {string} Encrypted data as base64 string
   */
  encryptRSA(data, publicKeyPem) {
    try {
      console.log('🔐 Шифрование RSA:', {
        dataLength: data.length,
        hasPublicKey: !!publicKeyPem,
        publicKeyFormat: publicKeyPem?.includes('-----BEGIN PUBLIC KEY-----') ? 'PEM' : 'INVALID'
      });
      
      if (!publicKeyPem || !publicKeyPem.includes('-----BEGIN PUBLIC KEY-----')) {
        throw new Error('Invalid public key PEM format');
      }
      
      const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
      const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      });
      const result = forge.util.encode64(encrypted);
      
      console.log('✅ Успешно зашифровано, длина:', result.length);
      return result;
    } catch (error) {
      console.error('❌ Ошибка шифрования RSA:', error);
      throw new Error('RSA encryption failed: ' + error.message);
    }
  }

  /**
   * Decrypt data with RSA private key
   * @param {string} encryptedBase64 - Encrypted data as base64 string
   * @param {string} privateKeyPem - RSA private key in PEM format
   * @returns {string} Decrypted data
   */
  decryptRSA(encryptedBase64, privateKeyPem) {
    try {
      // Validate PEM format
      if (!privateKeyPem || !privateKeyPem.includes('-----BEGIN') || !privateKeyPem.includes('PRIVATE KEY-----')) {
        throw new Error('Invalid private key format. Expected PEM format.');
      }
      
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      
      if (!encryptedBase64) {
        throw new Error('No encrypted data provided');
      }
      
      const encrypted = forge.util.decode64(encryptedBase64);
      const decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP', {
        md: forge.md.sha256.create()
      });
      return decrypted;
    } catch (error) {
      console.error('RSA Decryption error:', error);
      throw new Error('Failed to decrypt: ' + error.message);
    }
  }

  /**
   * Hybrid encryption: encrypt message with AES, encrypt AES key with RSA
   * @param {string} message - Plain text message
   * @param {string} recipientPublicKey - Recipient's RSA public key (PEM)
   * @param {string} senderId - Sender's user ID
   * @returns {object} Encrypted message package
   */
  encryptMessage(message, recipientPublicKey, senderId) {
    // Generate random AES key
    const aesKey = this.generateAESKey();
    
    // Encrypt message with AES
    const { iv, encrypted } = this.encryptAES(message, aesKey);
    
    // Encrypt AES key with recipient's RSA public key
    const encryptedAesKey = this.encryptRSA(aesKey, recipientPublicKey);
    
    // Create message package
    return {
      version: '1.0',
      senderId: senderId,
      timestamp: Date.now(),
      encryptedAesKey: encryptedAesKey,
      iv: iv,
      encryptedData: encrypted,
      algorithm: {
        symmetric: 'AES-256-CBC',
        asymmetric: 'RSA-OAEP-SHA256'
      }
    };
  }

  /**
   * Decrypt hybrid encrypted message
   * @param {object} messagePackage - Encrypted message package
   * @param {string} privateKeyPem - Recipient's RSA private key (PEM)
   * @returns {string} Decrypted message
   */
  decryptMessage(messagePackage, privateKeyPem) {
    try {
      // Decrypt AES key with RSA private key
      const aesKeyHex = this.decryptRSA(messagePackage.encryptedAesKey, privateKeyPem);
      
      // Decrypt message with AES key
      const message = this.decryptAES(
        messagePackage.encryptedData,
        aesKeyHex,
        messagePackage.iv
      );
      
      return message;
    } catch (error) {
      console.error('Message decryption error:', error);
      console.error('Invalid private key or corrupted message');
      throw new Error('Cannot decrypt message: ' + error.message);
    }
  }

  /**
   * Sign data with RSA private key
   * @param {string} data - Data to sign
   * @param {string} privateKeyPem - RSA private key (PEM)
   * @returns {string} Signature as base64 string
   */
  signData(data, privateKeyPem) {
    const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = privateKey.sign(md);
    return forge.util.encode64(signature);
  }

  /**
   * Verify signature with RSA public key
   * @param {string} data - Original data
   * @param {string} signatureBase64 - Signature as base64 string
   * @param {string} publicKeyPem - RSA public key (PEM)
   * @returns {boolean} True if signature is valid
   */
  verifySignature(data, signatureBase64, publicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const md = forge.md.sha256.create();
    md.update(data, 'utf8');
    const signature = forge.util.decode64(signatureBase64);
    return publicKey.verify(md.digest().bytes(), signature);
  }

  /**
   * Get public key fingerprint (for user identification)
   * @param {string} publicKeyPem - RSA public key (PEM)
   * @returns {string} SHA256 fingerprint as hex string
   */
  getPublicKeyFingerprint(publicKeyPem) {
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const der = forge.asn1.toDer(forge.pki.publicKeyToAsn1(publicKey)).getBytes();
    const md = forge.md.sha256.create();
    md.update(der);
    return md.digest().toHex();
  }

  /**
   * Extract public key from private key PEM
   * @param {string} privateKeyPem - RSA private key (PEM)
   * @returns {string} Public key in PEM format
   */
  extractPublicKey(privateKeyPem) {
    try {
      const privateKey = forge.pki.privateKeyFromPem(privateKeyPem);
      const publicKey = privateKey.publicKey || forge.pki.setRsaPublicKey(privateKey.n, privateKey.e);
      return forge.pki.publicKeyToPem(publicKey);
    } catch (error) {
      console.error('Error extracting public key:', error);
      throw new Error('Failed to extract public key from private key');
    }
  }
}

export default new CryptoManager();
