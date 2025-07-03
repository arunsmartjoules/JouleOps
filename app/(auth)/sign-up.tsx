import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { account } from "@/util/appwrite";
import { ID } from "react-native-appwrite";

export default function SignUpScreen() {
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visibilityOff, setVisibilityOff] = React.useState<boolean>(true);
  const router = useRouter();
  const onSignUpPress = async () => {
    try {
      const promise = await account.create(ID.unique(), emailAddress, password);
      console.log("Account Created", promise);
      router.push("/");
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-blue-50 p-2">
      <View className="justify-center w-full">
        <View className="p-4 gap-[50px] rounded-lg">
          <View className="justify-center items-center gap-2">
            <Text className="text-3xl font-bold">Welcome to JouleOps</Text>
            <Text>Sign Up to get Started</Text>
          </View>
          <View>
            <View className="w-full flex-row items-center gap-2 border-b border-slate-300">
              <MaterialIcons name="email" size={20} />
              <TextInput
                className="flex-1"
                placeholder="Enter your email"
                keyboardType="email-address"
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.nativeEvent.text)}
              />
            </View>
          </View>

          <View>
            <View className="w-full flex-row items-center gap-2 border-b border-slate-300">
              <MaterialIcons name="lock" size={20} />
              <TextInput
                className="flex-1"
                placeholder="Enter your password"
                value={password}
                secureTextEntry={visibilityOff}
                onChange={(e) => setPassword(e.nativeEvent.text)}
              />
              <MaterialIcons
                name={visibilityOff ? "visibility-off" : "visibility"}
                size={20}
                onPress={() => setVisibilityOff(!visibilityOff)}
              />
            </View>
          </View>

          <TouchableOpacity
            className="bg-blue-600 py-3 px-6 rounded-full mb-[50px]"
            onPress={onSignUpPress}
          >
            <Text className="text-white text-center">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row gap-2 justify-center items-center">
          <Text>Already have an account?</Text>
          <Link href="/sign-in" className="text-blue-600">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  );
}
