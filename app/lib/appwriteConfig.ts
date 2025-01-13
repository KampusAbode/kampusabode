const config = {
  appwriteEndpoint: String(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT),
  appwriteProjectId: String(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID),
}

export default config;














// import {
//   Account,
//   Avatars,
//   Client,
//   OAuthProvider,
// } from "appwrite";

// export const config = {
//     endpoint: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT,
//     projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID,
//     platform: "www.kampusabode.com",
//     locale: "en"
// }


// export const client = new Client()
// client
//     .setEndpoint(config.endpoint)
//     .setProject(config.projectId)


// export const avatar = new Avatars(client);
// export const account = new Account(client);

// export async function Login(email, password) {
//     try {
//         const redirectUri = 'https://www.kampusabode.com';
//         const response = await account.createOAuth2Token(OAuthProvider.Google, redirectUri);
//         if (!response) throw new Error('Failed to login');


//         const response = await account.createOAuth2Session(OAuthProvider.Google, redirectUri, redirectUri);

        
//         // const response =  await account.createSession(email, password);
//         return error;
//     }
// }