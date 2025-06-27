import { View, Text } from "react-native";
import React from "react";

interface ActivityCardProps {
  pendingCount: number;
  completedCount: number;
  className: string;
}
const TitleCard = ({
  pendingCount,
  completedCount,
  className,
}: ActivityCardProps) => {
  return (
    <View className={` flex-row w-full gap-2 p-2 bg-blue-200 ${className}`}>
      <View className="h-full flex-1 bg-white justify-center  drop-shadow flex-col gap-2 items-center rounded-2xl">
        <Text className="text-slate-800 font-bold text-sm">Pending</Text>
        <Text className="text-center text-xl">{pendingCount}</Text>
      </View>
      <View className="h-full w-1/2 bg-white p-3 justify-center drop-shadow flex-col gap-2 items-center rounded-2xl">
        <Text className="text-slate-800 font-bold">Completed</Text>
        <Text className="text-center text-xl">{completedCount}</Text>
      </View>
    </View>
  );
};

export default TitleCard;
