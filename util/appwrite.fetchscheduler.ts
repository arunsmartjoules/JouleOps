import { Query } from "react-native-appwrite";
import { databases } from "./appwrite";

export const createMaintenanceScheduler = async (
  site_list: any,
  schedule_date: string,
  store: any
) => {
  const wrapper = `[${site_list}]`;
  const my_sites = JSON.parse(wrapper);
  const result = await Promise.allSettled(
    my_sites.map(async (site: any) => {
      try {
        const promise = await databases.listDocuments(
          store.database_id,
          store.collections.maintenance_scheduler_task_list,
          [
            Query.equal("site_id", site.ID.toString()),
            Query.equal("schedule_date", schedule_date),
          ]
        );
        return promise.documents;
      } catch (error: any) {
        console.log("Error fetching scheduler documents", error);
        return [];
      }
    })
  );

  const taskListData = result
    .filter((r) => r?.status === "fulfilled" && Array.isArray(r.value)) // safe check
    .flatMap((r: any) => r.value);

  const combinedData = Object.values(
    taskListData.reduce((acc, curr) => {
      const key = curr.maintenance_scheduler_id;
      if (!acc[key]) {
        acc[key] = curr;
      }
      return acc;
    }, {})
  );
  if (!Array.isArray(taskListData)) {
    console.error("taskListData is not an array", taskListData);
    return { combinedData: [], taskListData: [] };
  }
  return { combinedData, taskListData };
};
