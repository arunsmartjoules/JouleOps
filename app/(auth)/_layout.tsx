import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { account } from "@/util/appwrite";

export default function AuthRoutesLayout() {
  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        await account.get();
        router.push("/");
      } catch (error: any) {
        router.push("/(auth)/sign-in");
      }
    };
    fetchUser();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
