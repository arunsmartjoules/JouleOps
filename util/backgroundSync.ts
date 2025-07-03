import { useOfflineSyncStore } from "@/storing/store";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_TASK_NAME = "sync-offline-data";

TaskManager.defineTask(BACKGROUND_TASK_NAME, async () => {
  try {
    const { syncQueue } = useOfflineSyncStore.getState();
    await syncQueue();
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    console.error("Error syncing offline data", error);
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerBackgroundTask() {
  const isRegistered = await TaskManager.isTaskRegisteredAsync(
    BACKGROUND_TASK_NAME
  );

  if (!isRegistered) {
    try {
      await BackgroundTask.registerTaskAsync(BACKGROUND_TASK_NAME, {
        minimumInterval: 30 * 60, // 30 minutes in seconds
      });
      console.log("✅ Background task registered");
    } catch (err) {
      console.error("❌ Failed to register background task:", err);
    }
  } else {
    console.log("ℹ️ Background task already registered");
  }
}
