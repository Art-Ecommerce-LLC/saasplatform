import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from 'crypto';
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Decryption function
export function decrypt(encryptedText: string) {
  const [ivString, encryptedTextString] = encryptedText.split(':');
  const iv = Buffer.from(ivString, 'hex');
  const encryptedBuffer = Buffer.from(encryptedTextString, 'hex');
  
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.SECRET_KEY!, 'hex'), iv);
  let decrypted = decipher.update(encryptedBuffer);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted.toString();
}

// Encryption settings (AES-256-CBC)
const algorithm = 'aes-256-cbc';
const secretKey = process.env.SECRET_KEY!;  // Use a secure secret key in your environment variables
const iv = crypto.randomBytes(16);  // Initialization vector

// Function to encrypt sensitive data
export function encrypt(text: string) {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;  // Combine IV and encrypted text
}