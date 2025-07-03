import { useAppwriteZohoUser } from "@/storing/appwrite.store";
import { account } from "@/util/appwrite";
import { createContext, useContext, useEffect, useState } from "react";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | null>(null);

const AuthProvider = ({ children }: any) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { fetchZohoUser } = useAppwriteZohoUser();

  const checkAuth = async () => {
    setLoading(true);
    try {
      const checkSession = await account.get();
      setUser(checkSession);
      setSession(checkSession);
      fetchZohoUser(checkSession.email);
    } catch (error: any) {
      console.log("No Actice session found");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const promise = await account.createEmailPasswordSession(email, password);
      setSession(promise);
      const currentUser = await account.get();
      setUser(currentUser);
    } catch (error: any) {
      console.log("Error signed in", error);
    } finally {
      setLoading(false);
    }
  };
  const signOut = async () => {
    setLoading(true);
    try {
      await account.deleteSession("current");
      setSession(null);
      setLoading(false);
    } catch (error: any) {
      console.log("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };
  const contextData: AuthContextType = {
    session,
    user,
    signIn,
    signOut,
    loading,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <SafeAreaView>
          <View>
            <Text>Loading...</Text>
          </View>
        </SafeAreaView>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("❗useAuth must be used inside an AuthProvider");
  }
  return context;
};

export { useAuth, AuthProvider };
