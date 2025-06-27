import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [visibilityOff, setVisibilityOff] = useState<boolean>(true);
  const [error, setError] = useState<string | any>(null);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-blue-50 p-2">
      <View className="justify-center w-full">
        <View className="p-4 gap-y-[60px] rounded-lg">
          <View className="justify-center items-center">
            <Text className="text-3xl font-bold">Welcome Back!</Text>
            <Text>Sign in to get started</Text>
          </View>
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
          <TouchableOpacity
            className="bg-blue-600 py-3 px-6 rounded-full mb-[50px]"
            onPress={onSignInPress}
          >
            <Text className="text-white text-center">Sign In</Text>
          </TouchableOpacity>
          {error && (
            <View>
              <Text>{"Sign In Failed " + error}</Text>
            </View>
          )}
        </View>
        <View className="flex-row gap-2 justify-center items-center">
          <Text>Click here to</Text>
          <Link href="/sign-up" className="text-blue-600">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  );
}
