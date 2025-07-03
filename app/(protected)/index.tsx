import {
  View,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  Text,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import dayjs from "dayjs";
import ActivityCard from "@/components/ActivityCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import InputBox from "@/components/InputBox";
import Scanner from "@/components/Scanner";
import { getRecords } from "@/util/zohoApi";
import "expo-dev-client";
import {
  useAppWriteStore,
  useAppwriteZohoUser,
  useMaintenanceSchedulerReport,
} from "@/storing/appwrite.store";
import { createMaintenanceScheduler } from "@/util/appwrite.fetchscheduler";

const Index = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startDateCalendar, setStartDateCalendar] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const [openQr, setOpenQr] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<any>([]);
  const [tab, setTab] = useState<string>("Pending");

  const { user } = useAppwriteZohoUser();
  const { store } = useAppWriteStore();

  const { scheduler_data, setSchedulerData, setTaskData } =
    useMaintenanceSchedulerReport();

  interface HandleApply {
    (date: any): Promise<void>;
  }

  useEffect(() => {
    if (!user) return;
    const start = async () => {
      const { my_sites } = user;
      try {
        const response = await createMaintenanceScheduler(
          my_sites,
          dayjs(startDate).format("DD-MMM-YYYY"),
          store
        );
        const { combinedData, taskListData } = response;
        setSchedulerData(combinedData);
        setTaskData(taskListData);
      } catch (error: any) {
        console.log("Error fetching data from store", error);
      }
    };
    start();
  }, [user, startDate]); // ← Add `startDate` here

  useEffect(() => {
    if (!scheduler_data) return;
    setActivityList(scheduler_data);
  }, [scheduler_data]);

  const handleDateChange: HandleApply = async (date: any) => {
    setStartDateCalendar(false);
    setStartDate(date);
  };

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
              keyExtractor={(item: any) =>
                item.maintenance_scheduler_id.toString()
              }
              data={activityList.filter((rec: any) => rec.status === "Pending")}
              renderItem={({ item, index }) => <ActivityCard record={item} />}
            />
          ) : (
            <FlatList
              keyExtractor={(item: any) =>
                item.maintenance_scheduler_id.toString()
              }
              data={activityList.filter(
                (rec: any) => rec.status === "Completed"
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
