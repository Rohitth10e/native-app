import { Account, Client } from 'react-native-appwrite';

const client = new Client()
                    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
                    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)
                    .setPlatform(process.env.EXPO_PUBLIC_APPWRITE_PLATFORM!);

const account = new Account(client)

export { account, client };

