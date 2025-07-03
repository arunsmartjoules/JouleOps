import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { databases } from "@/util/appwrite";
import { useAppWriteStore } from "@/storing/appwrite.store";
import { Query, ID } from "react-native-appwrite";

interface Task {
  record: any;
  className: string;
  taskDetail: any;
  onComplete: () => void;
}

interface Choice {
  ID: string;
  Choice: string;
}

const TaskCard = ({ record, className, taskDetail, onComplete }: Task) => {
  const [response, setResponse] = useState<string>("");
  const [choices, setChoices] = useState<Choice[]>([]);
  const [img, setImg] = useState<any>(null);
  const [preview, setPreview] = useState<boolean>(false);
  const [remarks, setRemarks] = useState<string>("");

  const { store } = useAppWriteStore();

  useEffect(() => {
    if (!taskDetail) return;
    const init = async () => {
      const wrapper = `[${taskDetail.choices}]`;
      const choice_list = JSON.parse(wrapper);
      setChoices(() => choice_list);
      setResponse(record.response ?? "");
      const img_url = record.Image
        ? `https://creatorapp.zohopublic.in/publishapi/v2/smartjoules/smart-joules-app/report/All_Maintenance_Scheduler_Task_List/${record?.$ID}/Image/download?privatelink=2W361xtEeUYvSCpz9OvhZNQQdfszJ5VzM9CDDdBA45uA6ZvZBjAugkemTskwKuqGYbyOUXRqAFwj0q1wSRnGmy3GYpgdPxXavS87`
        : null;
      setImg(img_url);
    };
    init();
  }, [record, taskDetail]);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Camera access is needed.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      mediaTypes: ["images"],
    });

    if (!result.canceled) {
      try {
        //   const asset = result.assets[0];
        //   setImg(asset);
        //   const formData = new FormData();
        //   formData.append("file", {
        //     uri: asset.uri,
        //     name: asset.fileName,
        //     type: "image/jpeg",
        //   } as any);
        //   formData.append("report_name", "All_Maintenance_Scheduler_Task_List");
        //   formData.append("id", record.$ID);
        //   const url = `http://192.168.31.171:4000/api/zoho/upload-file`;

        //   const response = await fetch(url, {
        //     method: "POST",
        //     body: formData,
        //     headers: {
        //       Accept: "application/json",
        //     },
        //   });
        //   const apiResult = await response.json();
        // console.log("Upload result", apiResult);
        Alert.alert("Image Successfully Uploaded");
      } catch (error: any) {
        console.error("Upload error:", error);
        Alert.alert("Upload failed", error);
      }
    }
  };

  const handleOnChange = async (choice: any, itemValue: any) => {
    try {
      const payload = {
        scheduler_task_id: record.$id.toString(),
        response: itemValue,
      };
      const listesDocs = await databases.listDocuments(
        store.database_id,
        store.collections.appwrite_pm_sync,
        [Query.equal("scheduler_task_id", record.$id)]
      );
      if (listesDocs.total > 0) {
        const updatedDoc = await databases.updateDocument(
          store.database_id,
          store.collections.appwrite_pm_sync,
          listesDocs.documents[0].$id,
          payload
        );
        console.log("Doc found and updated", updatedDoc);
        return;
      }
      const createdDoc = await databases.createDocument(
        store.database_id,
        store.collections.appwrite_pm_sync,
        ID.unique(),
        payload
      );
      console.log("Doc found and created", createdDoc);
    } catch (error: any) {
      console.log("Error pushing data to appwrite", error);
    }
  };

  const openImagePicker = async () => {};

  return (
    <View className={`border border-slate-300 rounded-2xl ${className}`}>
      <View className="flex-1">
        <View
          className={`${"bg-blue-100"} flex-row p-3 justify-between rounded-t-2xl`}
        >
          <Text>{record?.task}</Text>
        </View>

        <View className="rounded-b-2xl p-2 bg-white gap-2">
          <View className="flex-row gap-2">
            <View className="gap-4 flex-1">
              {record.field_type === "Multiple Choice" ||
              record.field_type === "Expense" ||
              record.field_type === "Consumption" ? (
                <View className="h-[40px] border justify-center rounded-lg border-slate-300 mt-3">
                  <Picker
                    selectedValue={response}
                    onValueChange={(itemValue: any, itemIndex: number) =>
                      handleOnChange("Choice", itemValue)
                    }
                  >
                    <Picker.Item label="Select an option" value="" />
                    {choices.map((choice: any) => (
                      <Picker.Item
                        key={choice.ID}
                        label={choice.Choice}
                        value={choice.Choice}
                      />
                    ))}
                  </Picker>
                </View>
              ) : record.field_type === "Number" ||
                record.field_type === "Meter Reading" ? (
                <View>
                  <TextInput
                    className="border border-slate-300 rounded"
                    placeholder="Response"
                    inputMode="numeric"
                    value={response}
                    onChange={(e) =>
                      handleOnChange("Number", e.nativeEvent.text)
                    }
                  />
                </View>
              ) : (
                <View>
                  <TextInput
                    className="border border-slate-300 rounded"
                    placeholder="Response"
                    value={response}
                    onChange={(e) => handleOnChange("Text", e.nativeEvent.text)}
                  />
                </View>
              )}
              <View>
                <TextInput
                  placeholder="Remarks"
                  className="border border-slate-300 rounded-lg px-3"
                  value={remarks}
                  onChange={(e) => setRemarks(e.nativeEvent.text)}
                />
              </View>
            </View>
            <View className="w-[6em] justify-center items-center">
              {img ? (
                <>
                  <Pressable onPress={() => setPreview(true)}>
                    <Image
                      alt="No Image"
                      source={img}
                      contentFit="cover"
                      transition={1000}
                      style={{ width: 70, height: 90, objectFit: "cover" }}
                    />
                  </Pressable>

                  <Modal
                    transparent
                    visible={preview}
                    onDismiss={() => setPreview(false)}
                    onRequestClose={() => setPreview(false)}
                    animationType="fade"
                  >
                    <View className="flex-1 justify-center items-center bg-black/50">
                      <Image
                        source={img}
                        contentFit="cover"
                        style={{
                          width: "90%",
                          height: "90%",
                          objectFit: "cover",
                        }}
                      />
                    </View>
                  </Modal>
                </>
              ) : (
                <View>
                  <MaterialIcons name="photo" size={40} color="#2563eb" />
                  <Text>No Image</Text>
                </View>
              )}
            </View>
          </View>

          <View className="flex-row justify-around items-center mt-2">
            <View className="items-center gap-1">
              <TouchableOpacity
                onPress={openImagePicker}
                className={`${"bg-blue-100"} p-3 rounded-full`}
              >
                <MaterialIcons name="upload" size={20} color={"#2563eb"} />
              </TouchableOpacity>
              <Text className="text-sm">Upload</Text>
            </View>
            <View className="items-center gap-1">
              <TouchableOpacity
                onPress={openCamera}
                className={`${"bg-blue-100"} p-3 rounded-full`}
              >
                <MaterialIcons name="camera" size={20} color={"#2563eb"} />
              </TouchableOpacity>
              <Text className="text-sm">Capture</Text>
            </View>
            <View className="items-center gap-1">
              <TouchableOpacity className={`${"bg-blue-100"} p-3 rounded-full`}>
                <MaterialIcons
                  name="multitrack-audio"
                  size={20}
                  color={"#2563eb"}
                />
              </TouchableOpacity>
              <Text className="text-sm">Audio</Text>
            </View>
            <View className="items-center gap-1">
              <TouchableOpacity className={`${"bg-blue-100"} p-3 rounded-full`}>
                <MaterialIcons
                  name="ondemand-video"
                  size={20}
                  color={"#2563eb"}
                />
              </TouchableOpacity>
              <Text className="text-sm">Video</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default TaskCard;
