import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  ScrollView,
} from "react-native";
import Signature from "react-native-signature-canvas";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import TaskCard from "@/components/TaskCard";
import Skeleton from "@/components/Skeleton";
import { useMaintenanceStore, useTaskStore } from "@/app/storing/store";
import NetInfo from "@react-native-community/netinfo";

const TaskList = () => {
  const { id } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkList, setCheckList] = useState<any[]>([]);
  const ref = useRef<any>(null);
  const [name, setName] = useState("");
  const [hasInternet, setHasInternet] = useState<boolean | null>(false);

  const handleSearch = (value: string) => setSearchText(value);

  const { data, loading } = useMaintenanceStore();

  const { data: taskData, fetchData: fetchTaskData } = useTaskStore();

  useEffect(() => {
    const start = async () => {
      const netInfo = await NetInfo.fetch();
      setHasInternet(netInfo.isConnected);
    };
    start();
  }, []);

  useEffect(() => {
    if (!data) return;
    const fetchData = async () => {
      const taskList = data.find((record: any) => record.ID === id);

      setCheckList(taskList.Tasks);
      await fetchTaskData();
    };

    fetchData();
  }, [data, id]);

  useEffect(() => {
    if (!taskData) return;
    const fetchData = async () => {
      const taskList = taskData.find(
        (rec: any) => rec.ID === checkList[0].Maintenance_Master
      );
      setAllTasks(taskList.Task);
    };
    fetchData();
  }, [taskData]);

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };
  const handleOK = (signature: string) => {
    // signature is a base64 encoded png
    console.log("Signature base64:", signature);
  };

  const onComplete = async () => {};

  return (
    <View className="flex-1">
      <View className="mb-2 mt-3 flex-row justify-end px-2 gap-2">
        <View className="px-2 flex-row items-center bg-white overflow-hidden border border-slate-300 rounded-lg flex-1">
          <TextInput
            placeholder="Search Task..."
            className="flex-1 h-full"
            value={searchText}
            onChange={(e) => handleSearch(e.nativeEvent.text)}
          />
          <MaterialIcons name="search" size={20} color="#cbd5e1" />
        </View>
      </View>
      <View className="flex-1">
        {loading && <Skeleton />}
        {!loading && (
          <View>
            <ScrollView>
              {checkList &&
                checkList.map((item, index) => {
                  const taskDetail = allTasks.find(
                    (task: any) => task.Task_Name === item.Task_Name
                  );
                  if (!taskDetail) return null;
                  return (
                    <TaskCard
                      key={item.ID}
                      taskDetail={taskDetail}
                      onComplete={onComplete}
                      className="mb-3"
                      record={item}
                    />
                  );
                })}
            </ScrollView>
          </View>
        )}
      </View>
      {hasInternet && (
        <View className="p-5 bg-white">
          <TouchableOpacity
            className="bg-blue-600 py-3 rounded-2xl"
            onPress={() => setModalVisible(true)}
          >
            <Text className="text-lg text-white text-center">Submit</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            transparent
          >
            <View className="flex-1 bg-black/50 justify-center p-3 items-center">
              <View className=" bg-white rounded-lg p-4 w-full">
                <View className="w-full gap-4">
                  <Text className="">Name</Text>
                  <TextInput
                    placeholder="Enter Your Name"
                    className="border border-slate-300 rounded-lg p-2"
                    value={name}
                    onChangeText={(text) => setName(text)}
                  />
                  <View className="flex-row justify-between">
                    <Text>Signature</Text>
                  </View>
                  <View className="h-40 gap-3 border border-slate-300 rounded-lg">
                    <Signature
                      ref={ref}
                      onOK={handleOK}
                      descriptionText="Sign"
                      clearText="Clear"
                      confirmText="Save"
                      autoClear={false}
                      imageType="image/png"
                      webStyle={`
                    .m-signature-pad--footer {
                      display: none;
                      margin: 0px;
                    }
                    .m-signature-pad--footer {
                      display: none; margin: 0px;}`}
                    />
                  </View>
                  <View className="flex-row justify-end">
                    <TouchableOpacity
                      onPress={handleClear}
                      className=" rounded-full bg-red-600 px-2 py-1 justify-center items-center"
                    >
                      <Text className="text-white text-center text-xs">
                        Clear
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <View className="">
                    <TouchableOpacity
                      className="bg-blue-600 p-2 px-4 rounded-lg justify-center items-center"
                      onPress={handleConfirm}
                    >
                      <Text className="text-white text-center text-sm">
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default TaskList;
