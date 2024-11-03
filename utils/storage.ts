import CryptoJS from 'crypto-js';

const STORAGE_KEY = 'jira_credentials';
const ENCRYPTION_KEY = 'your-secret-key'; // In production, use an environment variable

export interface StoredCredentials {
  instanceUrl: string;
  email: string;
  apiToken: string;
}

export const saveCredentials = (credentials: StoredCredentials) => {
  try {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(credentials),
      ENCRYPTION_KEY
    ).toString();
    localStorage.setItem(STORAGE_KEY, encrypted);
  } catch (error) {
    console.error('Error saving credentials:', error);
  }
};

export const getCredentials = (): StoredCredentials | null => {
  try {
    const encrypted = localStorage.getItem(STORAGE_KEY);
    if (!encrypted) return null;

    const decrypted = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY).toString(
      CryptoJS.enc.Utf8
    );
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

export const clearCredentials = () => {
  localStorage.removeItem(STORAGE_KEY);
}; 