import CryptoJS from 'crypto-js';

class AesEncryptionService {
  // It's better to read keys from environment variables for security
  private secretKey: string;
  private iv: string;

  constructor() {
    this.secretKey = process.env.NEXT_PUBLIC_AES_SECRET_KEY || 'mysecretkey12345'; // fallback
    this.iv = process.env.NEXT_PUBLIC_AES_IV || '1234567890abcdef'; // fallback

    if (this.secretKey.length !== 16 || this.iv.length !== 16) {
      throw new Error('AES key and IV must be 16 characters long.');
    }
  }

  encrypt(plaintext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return encrypted.toString(); // Base64
  }

  decrypt(ciphertext: string): string {
    const key = CryptoJS.enc.Utf8.parse(this.secretKey);
    const iv = CryptoJS.enc.Utf8.parse(this.iv);

    const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}

export const aesEncryptionService = new AesEncryptionService();
