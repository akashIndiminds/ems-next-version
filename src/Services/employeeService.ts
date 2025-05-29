import { aesEncryptionService } from '@/utils/encryption';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;
export interface EmployeeDetails {
  employee_code: string;
  employee_full_name: string;
  message?: string;
}

class EmployeeService {
  private apiUrl = `${baseUrl}/EmployeeDetails`;

  async getEmployeeDetails(employeeCode: string): Promise<EmployeeDetails> {
    try {
      console.log('Fetching Employee Details for:', employeeCode);

      // Encrypt the employee code
      const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
      console.log('Encrypted Employee Code:', encryptedEmployeeCode);

      // Create URL-safe encoded version of the encrypted value
      const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);

      // Build the query string manually to preserve encryption
      const queryString = `?EmployeeCode=${encodedEmployeeCode}`;
      
      // Construct the full URL
      const fullUrl = `${this.apiUrl}${queryString}`;

      // Prepare headers
      const headers = {
        'Content-Type': 'application/json',
      };

      // Send the POST request
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: null,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching employee details:', error);
      throw error;
    }
  }

  // Additional method to get employee profile with more details
  async getEmployeeProfile(employeeCode: string): Promise<any> {
    try {
      const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
      const encodedEmployeeCode = encodeURIComponent(encryptedEmployeeCode);
      
      const response = await fetch(`${this.apiUrl}/profile?EmployeeCode=${encodedEmployeeCode}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching employee profile:', error);
      throw error;
    }
  }

  // Method to update employee details
  async updateEmployeeDetails(employeeCode: string, updates: Partial<EmployeeDetails>): Promise<any> {
    try {
      const encryptedEmployeeCode = aesEncryptionService.encrypt(employeeCode);
      
      const response = await fetch(`${this.apiUrl}/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeCode: encryptedEmployeeCode,
          ...updates
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating employee details:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const employeeService = new EmployeeService();