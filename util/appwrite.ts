import { Platform } from "react-native";
import { Client, Databases, Account, Storage } from "react-native-appwrite";

const END_POINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || "";
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || "";

const platformId =
  Platform.OS === "ios"
    ? "com.arundev2025.jouleopsmobile.ios"
    : "com.arundev2025.jouleopsmobile";

const client = new Client()
  .setEndpoint(END_POINT)
  .setProject(PROJECT_ID)
  .setPlatform(platformId);

const databases = new Databases(client);
const account = new Account(client);
const storage = new Storage(client);
export { databases, account, storage };
