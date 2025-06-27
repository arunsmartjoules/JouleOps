import * as React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-50 p-2">
        <View className="gap-[30px] w-full">
          <View className="w-full">
            <Text className="text-center text-xl font-bold">
              Verify your email
            </Text>
          </View>
          <View>
            <View className="w-full flex-row items-center gap-2 border-b border-slate-300">
              <TextInput
                value={code}
                placeholder="Enter your verification code"
                autoComplete="sms-otp"
                onChangeText={(code) => setCode(code)}
              />
            </View>
            <View className="mt-5">
              <TouchableOpacity
                onPress={onVerifyPress}
                className="bg-blue-600 py-3 px-6 rounded-full mb-[50px]"
              >
                <Text className="text-white text-center">Verify</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

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
                placeholder="Choose your password"
                secureTextEntry
                value={password}
                onChange={(e) => setPassword(e.nativeEvent.text)}
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
