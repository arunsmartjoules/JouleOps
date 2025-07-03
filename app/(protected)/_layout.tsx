import { Redirect, Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/context/AuthContext";

const Layout = () => {
  const { user } = useAuth();
  if (!user) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={25} color={color} />
          ),

          tabBarInactiveTintColor: "#000",
          tabBarLabel: "Home",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={25} color={color} />
          ),

          tabBarLabel: "Profile",
        }}
      />
      <Tabs.Screen
        name="[id]"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
};

export default Layout;
