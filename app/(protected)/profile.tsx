import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useClerk, useUser } from "@clerk/clerk-expo";
import { useUserStore } from "../storing/store";

const Profile = () => {
  const [imgUrl, setImgUrl] = useState<any>(null);
  const router = useRouter();
  const { signOut } = useClerk();

  const [employee, setEmployee] = useState<any>(null);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/sign-in");
    } catch (error) {
      console.error("Errr Signing out", error);
    }
  };

  const { data } = useUserStore();

  useEffect(() => {
    if (data) {
      setEmployee(data);
    }
  }, [data]);

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
              value={employee?.Employee_Name}
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Email</Text>
            <TextInput
              value={employee?.Email}
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Sites</Text>
            <TextInput
              value={employee?.Sites.map((site: any) => site.Site_Name).join(
                ", "
              )}
              multiline
              readOnly
              className="bg-transparent border border-slate-300 rounded-md"
            />
          </View>
          <View className="flex-col gap-1 mb-3 w-full">
            <Text>Designation</Text>
            <TextInput
              value={employee?.Designation.Role_Name}
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
