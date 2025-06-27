import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";

const CustomTabs = ({ tabs, className }: any) => {
  const [index, setIndex] = useState(0);

  const ACTIVE_TAB_COLOR = "bg-blue-600 rounded-full";
  const INACTIVE_TAB_COLOR = "text-gray-600 rounded-full";

  return (
    <View className={`w-full p-1 flex-1 ${className}`}>
      <View className="flex-row">
        {tabs.map((tab: any, i: number) => {
          const isActive = index === i;
          return (
            <TouchableOpacity
              key={tab.key ?? i}
              onPress={() => setIndex(i)}
              className={`flex-1 py-2 px-4 justify-center items-center ${
                isActive ? ACTIVE_TAB_COLOR : INACTIVE_TAB_COLOR
              }`}
            >
              <Text
                className={`font-semibold text-sm ${
                  index === tab.key && "text-white"
                }`}
              >
                {tab.title || ""}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View className="flex-1">{tabs[index]?.content}</View>
    </View>
  );
};

export default CustomTabs;
