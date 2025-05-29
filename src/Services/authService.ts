import { aesEncryptionService } from '@/utils/encryption';

export interface User {
  employeeCode: string;
  name?: string;
  email?: string;
  role?: string;
}

class AuthService {
  private employeeCodeKey = 'employeeCode';
  private userDataKey = 'userData';

  private isLocalStorageAvailable(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  setEmployeeCode(code: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedCode = aesEncryptionService.encrypt(code);
        console.log("Auth file encrypted code:", encryptedCode);
        localStorage.setItem(this.employeeCodeKey, encryptedCode);
      } catch (error) {
        console.error('Error encrypting employee code:', error);
      }
    } else {
      console.warn('localStorage is not available. Employee code will not persist.');
    }
  }

  getEmployeeCode(): string {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedCode = localStorage.getItem(this.employeeCodeKey);
        if (encryptedCode) {
          return aesEncryptionService.decrypt(encryptedCode);
        }
      } catch (error) {
        console.error('Error decrypting employee code:', error);
        // Clean up corrupted data
        localStorage.removeItem(this.employeeCodeKey);
      }
    } else {
      console.warn('localStorage is not available. Returning NA for employee code.');
    }
    return 'NA';
  }

  setUserData(userData: User): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedUserData = aesEncryptionService.encrypt(JSON.stringify(userData));
        localStorage.setItem(this.userDataKey, encryptedUserData);
        
        // Also set employee code separately for backward compatibility
        this.setEmployeeCode(userData.employeeCode);
      } catch (error) {
        console.error('Error encrypting user data:', error);
      }
    }
  }

  getUserData(): User | null {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedUserData = localStorage.getItem(this.userDataKey);
        if (encryptedUserData) {
          const decryptedData = aesEncryptionService.decrypt(encryptedUserData);
          return JSON.parse(decryptedData);
        }
      } catch (error) {
        console.error('Error decrypting user data:', error);
        localStorage.removeItem(this.userDataKey);
      }
    }
    return null;
  }

  isAuthenticated(): boolean {
    const employeeCode = this.getEmployeeCode();
    return employeeCode !== 'NA' && employeeCode.length > 0;
  }

  login(employeeCode: string, additionalData?: Partial<User>): void {
    this.setEmployeeCode(employeeCode);
    
    if (additionalData) {
      this.setUserData({
        employeeCode,
        ...additionalData
      });
    }
    
    console.log('User logged in successfully with employee code:', employeeCode);
  }

  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(this.employeeCodeKey);
      localStorage.removeItem(this.userDataKey);
      
      // Clear any other auth-related data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('auth_') || key.startsWith('user_')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      console.log('User logged out and all auth data cleared.');
    } else {
      console.warn('localStorage is not available. Could not log out completely.');
    }
  }

  // Token-based authentication methods (for future use)
  setAuthToken(token: string): void {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedToken = aesEncryptionService.encrypt(token);
        localStorage.setItem('authToken', encryptedToken);
      } catch (error) {
        console.error('Error encrypting auth token:', error);
      }
    }
  }

  getAuthToken(): string | null {
    if (this.isLocalStorageAvailable()) {
      try {
        const encryptedToken = localStorage.getItem('authToken');
        if (encryptedToken) {
          return aesEncryptionService.decrypt(encryptedToken);
        }
      } catch (error) {
        console.error('Error decrypting auth token:', error);
        localStorage.removeItem('authToken'); // Clean up corrupted token
      }
    }
    return null;
  }
}

export const authService = new AuthService();
