import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Text,
  FlatList,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import ActivityCard from "@/components/ActivityCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputBox from "@/components/InputBox";
import Scanner from "@/components/Scanner";
import { useMaintenanceStore, useUserStore } from "../storing/store";
import { getRecords } from "@/util/zohoApi";
import NetInfo from "@react-native-community/netinfo";
import { useUser } from "@clerk/clerk-expo";
import "expo-dev-client";
import { registerBackgroundTask } from "@/util/backgroundSync";

const Index = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDateCalendar, setStartDateCalendar] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [openQr, setOpenQr] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<any>([]);
  const [tab, setTab] = useState<string>("Pending");

  const {
    data: user,
    fetchData: fetchUser,
    loadCache: loadUserCache,
  } = useUserStore();

  const { data, loading, error, fetchData, updateData, loadCache } =
    useMaintenanceStore();

  const { user: loginUser } = useUser();

  interface HandleApply {
    (date: any): Promise<void>;
  }

  useEffect(() => {
    if (Platform.OS === "android" || Platform.OS === "ios") {
      registerBackgroundTask();
    }
  }, []);

  useEffect(() => {
    if (!user?.Sites) return;
    const start = async () => {
      setStartDate(new Date());
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        const site_list = user.Sites.map((i: any) => i.ID);
        await fetchData(site_list);
        return;
      }
      await loadCache();
    };
    start();
  }, [user]);

  useEffect(() => {
    const init = async () => {
      const netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        await fetchUser(loginUser?.emailAddresses[0].emailAddress);
        return;
      }
      loadUserCache();
    };
    init();
  }, [loginUser]);

  useEffect(() => {
    if (!data) return;
    setActivityList(data);
  }, [data]);

  const handleDateChange: HandleApply = async (date: any) => {
    setStartDateCalendar(false);
    setStartDate(date);
    const records = data.filter(
      (record: any) => record.Start_Date === dayjs(date).format("DD-MMM-YYYY")
    );
    if (records.length === 0) {
      const allData = await Promise.allSettled(
        data.Sites.map(async (site: any) => {
          try {
            const newData = await getRecords(
              "All_Maintenance_Scheduler_Report",
              `(Start_Date == '${dayjs(date).format(
                "DD-MMM-YYYY"
              )}') && (Site_Name))`
            );
            return newData.response.data;
          } catch (error: any) {
            console.log("Error fetching data", error);
            return [];
          }
        })
      );
      const combinedData = allData
        .filter((r) => r?.status === "fulfilled" && Array.isArray(r.value)) // safe check
        .flatMap((r: any) => r.value);

      updateData(combinedData);
    }
  };

  // TEst

  // Test

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleScan = async (result: any) => {
    const startDate = dayjs().startOf("month").format("DD-MMM-YYYY");
    const endDate = dayjs().endOf("month").format("DD-MMM-YYYY");
    const customCriteria = `(Area_ID == ${result}) && (Start_Date >= '${startDate}') && (Start_Date <= '${endDate}')`;
    const newData = await getRecords(
      "All_Maintenance_Scheduler_Report",
      customCriteria
    );
    updateData(newData.response.data);
    setOpenQr(false);
  };

  return (
    <View className="flex-1">
      {/* Cards */}
      {/* Search Bar */}
      <View className="h-[50px] flex-row items-center gap-2 p-2">
        <InputBox
          icon="search"
          className=""
          inputMode="string"
          onChange={handleSearch}
          value={searchText}
          placeHolder="Search..."
        />
        <TouchableOpacity
          className="bg-blue-600 p-2 rounded h-full"
          onPress={() => setStartDateCalendar(true)}
        >
          <MaterialIcons name="calendar-month" color="#fff" size={20} />
        </TouchableOpacity>
        {startDateCalendar && (
          <DateTimePicker
            mode="date"
            value={startDate}
            onChange={(event, date: any) => {
              handleDateChange(date);
            }}
          />
        )}

        <TouchableHighlight
          className="bg-blue-600 p-2 rounded h-full"
          onPress={() => setOpenQr(true)}
        >
          <MaterialIcons name="qr-code-scanner" color="#fff" size={20} />
        </TouchableHighlight>
        <Modal
          visible={openQr}
          onDismiss={() => setOpenQr(false)}
          onRequestClose={() => setOpenQr(false)}
        >
          <Scanner onScan={handleScan} className="" />
        </Modal>
      </View>
      {/* Activity List */}
      <View className="mt-2 flex-1 p-2">
        <View className="flex-row items-center rounded-2xl px-2">
          <TouchableOpacity className="w-1/2" onPress={() => setTab("Pending")}>
            <Text
              className={`text-center p-2 rounded-xl ${
                tab === "Pending" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              Pending
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-1/2 p-2"
            onPress={() => setTab("Completed")}
          >
            <Text
              className={`text-center p-2 rounded-xl ${
                tab === "Completed" ? "bg-blue-600 text-white" : "bg-white"
              }`}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          {tab === "Pending" ? (
            <FlatList
              keyExtractor={(item: any) => item.ID.toString()}
              data={activityList.filter(
                (rec: any) =>
                  rec.Start_Date === dayjs(startDate).format("DD-MMM-YYYY") &&
                  rec.Status === "Pending"
              )}
              renderItem={({ item, index }) => <ActivityCard record={item} />}
            />
          ) : (
            <FlatList
              keyExtractor={(item: any) => item.ID.toString()}
              data={activityList.filter(
                (rec: any) =>
                  rec.Start_Date === dayjs(startDate).format("DD-MMM-YYYY") &&
                  rec.Status === "Completed"
              )}
              renderItem={({ item, index }) => <ActivityCard record={item} />}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Index;
