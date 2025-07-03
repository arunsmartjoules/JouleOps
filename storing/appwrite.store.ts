import { databases } from "@/util/appwrite";
import { Query } from "react-native-appwrite";
import { create } from "zustand";

interface AppWriteStore {
  store: any;
}

interface MaintenanceSchedulerReport {
  task_data: any;
  scheduler_data: any;
  setSchedulerData: (data: any) => void;
  setTaskData: (data: any) => void;
}

interface AppWriteZohoUser {
  user: any;
  fetchZohoUser: (email: string) => Promise<void>;
}
export const useAppWriteStore = create<AppWriteStore>((set) => ({
  store: {
    database_id: "sjpl_zoho",
    collections: {
      users: "685d1eea0014a41bedb6",
      task_master: "685d1fef003a62695141",
      maintenance_scheduler_task_list: "685e6053002f1a36dc63",
      appwrite_pm_sync: "68653d1600092148a33c",
    },
  },
}));

export const useAppwriteZohoUser = create<AppWriteZohoUser>((set) => ({
  user: {},
  fetchZohoUser: async (email: string) => {
    try {
      const database = await databases.listDocuments(
        "sjpl_zoho",
        "685d1eea0014a41bedb6",
        [Query.equal("email", email)]
      );
      set({ user: database.documents[0] });
    } catch (error: any) {
      console.log("Error fetching zoho user", error);
    }
  },
}));

export const useMaintenanceSchedulerReport = create<MaintenanceSchedulerReport>(
  (set) => ({
    task_data: [],
    scheduler_data: [],
    setSchedulerData: (data: any) => {
      set({ scheduler_data: data });
    },
    setTaskData: (data: any) => {
      set({ task_data: data });
    },
  })
);
