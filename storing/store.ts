import { create } from "zustand";
import { getCache, storeCache } from "./cache";
import { getRecords, updateRecord } from "@/util/zohoApi";
import dayjs from "dayjs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

type MaintenanceSchedulerStore = {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (sites: any) => Promise<void>;
  updateData: (data: any) => void;
  modifyData: () => void;
  loadCache: () => Promise<void>;
};

type TaskStore = {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
  loadCache: () => Promise<void>;
};

type UserStore = {
  data: any;
  loading: boolean;
  error: string | null;
  fetchData: (email: any) => Promise<void>;
  loadCache: () => Promise<void>;
};

type OfflineSyncStore = {
  queue: any[];
  addToQueue: (data: any) => Promise<void>;
  syncQueue: () => Promise<void>;
  loadQueue: () => Promise<void>;
};

export const useUserStore = create<UserStore>((set) => ({
  data: null,
  loading: false,
  error: null,

  fetchData: async (email: any) => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({
        report_name: "All_Employees",
        criteria: `(Email == "${email}")`,
      });
      const result = await fetch(`/api/zoho?${query}`);
      const response = await result.json();
      set({ data: response.response.data[0], loading: false });
      await storeCache("user", response.response.data[0]);
    } catch (err: any) {
      set({ error: err.message || "Fetch error", loading: false });
    }
  },
  loadCache: async () => {
    const cached = await getCache("user");
    if (cached) set({ data: cached });
  },
}));

export const useMaintenanceStore = create<MaintenanceSchedulerStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async (sites) => {
    set({ loading: true, error: null });

    const results = await Promise.allSettled(
      sites.map(async (site_id: number) => {
        const start_date = `(Start_Date >= '${dayjs()
          .startOf("month")
          .format("DD-MMM-YYYY")}')`;
        const end_date = `(Start_Date <= '${dayjs().format("DD-MMM-YYYY")}')`;
        const criteria = `${start_date} && ${end_date} && (Site_Name == ${site_id})`;

        try {
          const query = new URLSearchParams({
            report_name: "All_Maintenance_Scheduler_Report",
            criteria,
          });
          const response = await fetch(`/api/zoho?${query}`);
          const result = await response.json();
          return result.response.data;
        } catch (err: any) {
          console.warn(`Failed to fetch site ${site_id}:`, err.message);
          return [];
        }
      })
    );

    const combinedData = results
      .filter((r) => r?.status === "fulfilled" && Array.isArray(r.value)) // safe check
      .flatMap((r: any) => r.value); // flatten all valid records

    await storeCache("maintenance_scheduler", combinedData);
    set({ data: combinedData, loading: false });
  },
  updateData: (newData: any) => {
    set((state) => {
      const newArr = [...state.data, ...newData];
      storeCache("maintenance_scheduler", newArr);
      return {
        data: newArr,
        loading: false,
      };
    });
  },
  modifyData: () => {},
  loadCache: async () => {
    const cached = await getCache("maintenance_scheduler");
    if (cached) set({ data: cached });
  },
}));

export const useTaskStore = create<TaskStore>((set) => ({
  data: [],
  loading: false,
  error: null,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const query = new URLSearchParams({
        report_name: "All_Maintenance_Report",
        criteria: "(ID != 0)",
      });
      const result = await fetch(`/api/zoho?${query}}`);
      const response = await result.json();
      await storeCache("tasks", response.response.data);
      set({
        data: response.response.data,
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message || "Fetch error", loading: false });
    }
  },

  loadCache: async () => {
    const cached = await getCache("tasks");
    if (cached) set({ data: cached });
  },
}));

export const useOfflineSyncStore = create<OfflineSyncStore>((set, get) => ({
  queue: [],
  addToQueue: async (data: any) => {
    const updatedQueue = [...get().queue, data];
    await AsyncStorage.setItem("offline_queue", JSON.stringify(updatedQueue));
    set({ queue: updatedQueue });
  },
  syncQueue: async () => {
    const net = await NetInfo.fetch();
    if (!net.isConnected) return;
    const currentQueue = [...get().queue];
    const success: any[] = [];
    for (const record of currentQueue) {
      try {
        const response = await updateRecord(
          record.report_name,
          record.data,
          record.id
        );
        success.push(response);
      } catch (error) {
        console.error("Error syncing record:", record, error);
      }
    }
    const remaining = currentQueue.filter((r) => !success.includes(r));
    await AsyncStorage.setItem("offline_queue", JSON.stringify(remaining));
    set({ queue: remaining });
  },
  loadQueue: async () => {
    const saved = await AsyncStorage.getItem("offline_queue");
    if (saved) {
      set({ queue: JSON.parse(saved) });
    }
  },
}));
