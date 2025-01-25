// appwriteClient.ts
import { Client, Storage, ID } from "appwrite";

// Initialize the Appwrite client
const client = new Client()
  .setEndpoint(`${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}`)
  .setProject(`${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`);

// Export necessary Appwrite services
export const storage = new Storage(client);
export { client, ID };
