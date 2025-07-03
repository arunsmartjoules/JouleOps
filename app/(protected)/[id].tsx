import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
} from "react-native";
import Signature from "react-native-signature-canvas";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useRef, useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import TaskCard from "@/components/TaskCard";
import {
  useAppWriteStore,
  useMaintenanceSchedulerReport,
} from "@/storing/appwrite.store";
import Skeleton from "@/components/Skeleton";
import { databases } from "@/util/appwrite";
import { Query } from "react-native-appwrite";

const TaskList = () => {
  const { id } = useLocalSearchParams();
  const [searchText, setSearchText] = useState("");
  const [allTasks, setAllTasks] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [checkList, setCheckList] = useState<any[]>([]);
  const ref = useRef<any>(null);
  const [name, setName] = useState("");

  const handleSearch = (value: string) => setSearchText(value);
  const [loading, setLoading] = useState<boolean>(false);

  const { store } = useAppWriteStore();

  const { task_data } = useMaintenanceSchedulerReport();

  useEffect(() => {
    const init = () => {
      const task_list = task_data?.filter(
        (task: any) => task.maintenance_scheduler_id == id
      );
      setCheckList(task_list);
    };
    init();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      const maintenenceMasterId = checkList[0].maintenance_master_id;
      try {
        const promise = await databases.listDocuments(
          store.database_id,
          store.collections.task_master,
          [Query.equal("maintenance_master_id", maintenenceMasterId)]
        );
        setAllTasks(promise.documents);
      } catch (error: any) {
        console.log("Error getting task master", error);
      }
    };

    fetchData();
  }, [checkList]);

  const handleClear = () => {
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    ref.current.readSignature();
  };
  const handleOK = (signature: string) => {
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
          <View className="p-1">
            <ScrollView>
              {checkList &&
                checkList.map((item, index) => {
                  const taskDetail = allTasks.find(
                    (task: any) => task.task === item.task
                  );
                  if (!taskDetail) return null;
                  return (
                    <TaskCard
                      key={item.$id}
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

                <View className="z-10">
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
    </View>
  );
};

export default TaskList;
