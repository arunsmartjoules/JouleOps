import { Stack } from "expo-router";
import "./global.css";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar, View } from "react-native";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <View className="flex-1">
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SafeAreaView className="flex-1 bg-white">
          <Stack>
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          </Stack>
        </SafeAreaView>
      </View>
    </AuthProvider>
  );
}
