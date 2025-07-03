import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { useAppWriteStore } from "@/storing/appwrite.store";
import { databases } from "@/util/appwrite";
import { Query } from "react-native-appwrite";

const Profile = () => {
  const [imgUrl, setImgUrl] = useState<any>(null);
  const { user } = useAuth();

  const router = useRouter();
  const { signOut } = useAuth();
  const { store } = useAppWriteStore();
  const [siteList, setSiteList] = useState<string>("");

  const [employee, setEmployee] = useState<any>(null);

  const handleSignOut = async () => {
    try {
      signOut();
      router.push("/(auth)/sign-in");
    } catch (error) {
      console.error("Errr Signing out", error);
    }
  };

  const fetchDataFromAppwrite = async () => {
    try {
      const data = await databases.listDocuments(
        store.database_id,
        store.collections.users,
        [Query.equal("email", user?.email)]
      );
      setEmployee(data.documents[0]);
      const site_list = data.documents[0].my_sites;
      const site_names = `[${site_list}]`;
      const siteArray = JSON.parse(site_names);
      const siteNames = siteArray.map((site: any) => site.Site_Name);
      setSiteList(siteNames.join(", "));
    } catch (error: any) {
      console.log("Error fetching data from appwrite", error);
    }
  };

  useEffect(() => {
    fetchDataFromAppwrite();
  }, []);

  return (
    <View className="flex-1 p-2">
      <View className="flex-1">
        <View className="justify-center items-center h-[150px]">
          <View className="bg-white rounded-full w-[100px] h-[100px] justify-center items-center">
            {imgUrl ? (
              <Image
                source={{ uri: imgUrl }}
                style={{ width: 100, height: 100 }}
              />
            ) : (
              <MaterialIcons name="person" size={70} color="#64748b" />
            )}
          </View>
        </View>
        <View className="bg-white px-3 py-4 gap-2 justify-center items-center rounded-lg">
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Name</Text>
            <TextInput
              value={employee?.employee_name}
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Email</Text>
            <TextInput
              value={employee?.email}
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Sites</Text>
            <TextInput
              value={siteList}
              multiline
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
        </View>
      </View>
      <View>
        <TouchableOpacity
          className="bg-blue-600 p-3 rounded-xl flex-row justify-center items-center"
          onPress={handleSignOut}
        >
          <Text className="text-white">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
