import { View, Text } from "react-native";
import React from "react";
import { Link } from "expo-router";

const ActivityCard = ({ record }: any) => {
  return (
    <View className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-2">
      <Link href={`/task/${record.ID}/task-list`}>
        <View className="bg-blue-100 flex-row p-2 justify-between w-full">
          <Text className="font-semibold text-slate-800 flex-1 text-wrap text-sm">
            {record?.Title}
          </Text>

          <Text className="text-sm">{record?.Start_Date}</Text>
        </View>
        <View className="bg-white flex-1 gap-2 p-2 rounded">
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">
              Site Name:{" "}
            </Text>
            <Text className="text-slate-800 text-sm">
              {record?.Site_Name.zc_display_value}
            </Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">Asset: </Text>
            <Text className="text-slate-800 text-sm">{record?.Area}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">Progress: </Text>
            <Text className="text-slate-800 text-sm">{record?.Progress}</Text>
          </View>
        </View>
      </Link>
    </View>
  );
};

export default ActivityCard;
