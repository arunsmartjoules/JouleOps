import * as FileSystem from "expo-file-system";
const getFilePath = (name: string) =>
  `${FileSystem.documentDirectory}${name}.cache`;

export const storeCache = async (name: string, data: any) => {
  try {
    await FileSystem.writeAsStringAsync(
      getFilePath(name),
      JSON.stringify(data),
      {
        encoding: FileSystem.EncodingType.UTF8,
      }
    );
  } catch (error) {
    console.error("Error storing cache", error);
  }
};

export const getCache = async (name: string) => {
  try {
    const filePath = getFilePath(name);
    const exists = await FileSystem.getInfoAsync(filePath);
    if (!exists.exists) return null;
    const content = await FileSystem.readAsStringAsync(filePath);
    return JSON.parse(content);
  } catch (error) {
    console.error("Error getting cache", error);
    return null;
  }
};
