import axios from 'axios';
const baseUrl=process.env.NEXT_PUBLIC_BASE_API;

export const registerEmployee = async (employeeData: any): Promise<any> => {
  const { FirstName, MiddleName, LastName, EmailID, PhoneNumber, JoiningDate } = employeeData;
  const queryParams = `?FirstName=${FirstName}&MiddleName=${MiddleName}&LastName=${LastName}&EmailID=${EmailID}&PhoneNumber=${PhoneNumber}&JoiningDate=${JoiningDate}`;
  const response = await axios.post(`${baseUrl}/RegisterEmployee${queryParams}`, {});
  return response.data;
};