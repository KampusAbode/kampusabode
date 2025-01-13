import config from "../appwriteConfig";
import { Client, Account, ID } from "appwrite";

type UserSignupInput = {
  username: string;
  email: string;
  password: string;
  userType: "student" | "agent";
  studentInfo?: {
    department: string;
  };
  agentInfo?: {
    agencyName: string;
    phoneNumber: string;
  };
};

type UserLoginInput = {
  email: string;
  password: string;
};

const appwriteClient = new Client();

appwriteClient
  .setEndpoint(config.appwriteEndpoint)
  .setProject(config.appwriteProjectId);

export const account = new Account(appwriteClient);

export class AppwriteService {
  //create a new record of user inside appwrite
  async createUserAccount({ userData }: { userData: UserSignupInput }) {
    const { email, password } = userData;

    try {
      const userAccount = await account.create(ID.unique(), email, password);

      if (userAccount) {
        return this.login({ userData });
      } else {
        return userAccount;
      }
    } catch (error: any) {
      throw error;
    }
  }
  async login({ userData }: { userData: UserLoginInput }) {
    const { email, password } = userData;

    try {
      account.createEmailPasswordSession(email, password);
    } catch (error: any) {
      throw error;
    }
  }

  async isLoggedIn(): Promise<boolean> {
    try {
      const data = await this.getCurrentUser();
      return Boolean(data);
    } catch (error) {}
  }

    async getCurrentUser() {
      try {
        return account.get()
      } catch (error) {
        console.log("getCurrentUser error: " + error)
      }
    }
    
    async logOut() {
        try {
            
        } catch (error) {
            console.log("logout error: " + error)
        }
    }
}

const appwriteService = new AppwriteService()

export default appwriteService
