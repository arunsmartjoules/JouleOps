import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { Link } from "expo-router";
import { useAppwriteZohoUser } from "@/storing/appwrite.store";

const ActivityCard = ({ record }: any) => {
  const { user } = useAppwriteZohoUser();

  const [siteName, setSiteName] = useState<string>("");

  useEffect(() => {
    if (!user.my_sites) return;
    const init = () => {
      const wrapper = `[${user.my_sites}]`;
      const site_list = JSON.parse(wrapper);
      const site_name = site_list.find(
        (site: any) => site.ID === record.site_id
      );
      setSiteName(site_name.Site_Name);
    };
    init();
  }, [user, record]);
  return (
    <View className="bg-white border border-slate-200 rounded-lg overflow-hidden mb-2">
      <Link href={`/${record?.maintenance_scheduler_id}`}>
        <View className="bg-blue-100 flex-row p-2 justify-between w-full">
          <Text className="font-semibold text-slate-800 flex-1 text-wrap text-sm">
            {record?.title}
          </Text>

          <Text className="text-sm">{record?.schedule_date}</Text>
        </View>
        <View className="bg-white flex-1 gap-2 p-2 rounded">
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">
              Site Name:{" "}
            </Text>
            <Text className="text-slate-800 text-sm">{siteName}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">Asset: </Text>
            <Text className="text-slate-800 text-sm">{record?.area}</Text>
          </View>
          <View className="flex-row">
            <Text className="font-bold text-slate-800 text-sm">Progress: </Text>
            <Text className="text-slate-800 text-sm">{record?.progress}</Text>
          </View>
        </View>
      </Link>
    </View>
  );
};

export default ActivityCard;
