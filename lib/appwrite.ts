import { Account, Client, Databases } from 'react-native-appwrite';

const client = new Client()
                    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
                    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
                    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

console.log("Project ID:", process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID);


const account = new Account(client)
const databases = new Databases(client)

const DATABASE_ID = process.env.EXPO_PUBLIC_DB_ID!
const HABITS_COLLECTION_ID = process.env.EXPO_PUBLIC_HABITS_COLLECTION_ID!
const HABITS_COMPLETION_COLLECTION_ID= process.env.EXPO_PUBLIC_HABITS_COMPLETION_COLLECTION_ID!
export interface RealTimeResponse {
    events: string[],
    payload:any;
}

export { account, client, DATABASE_ID, databases, HABITS_COLLECTION_ID, HABITS_COMPLETION_COLLECTION_ID };

