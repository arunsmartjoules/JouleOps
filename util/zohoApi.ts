import axios from "axios";
import { refreshAccessToken } from "./zohoAuth";

export async function getRecords(reportName: string, criteria: string) {
  try {
    const accessToken = await refreshAccessToken();
    const response = await axios.get(
      `https://www.zohoapis.in/creator/v2.1/data/smartjoules/smart-joules-app/report/${reportName}?max_records=1000&criteria=${encodeURIComponent(
        criteria
      )}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error getting record:",
      error.response?.data || error.message
    );
    return { error: error.response?.data || error.message };
  }
}

export async function updateRecord(data: any, reportName: string, id: number) {
  try {
    const accessToken = await refreshAccessToken();
    const formData = {
      data: data,
    };
    const response = await axios.patch(
      `https://www.zohoapis.in/creator/v2.1/data/smartjoules/smart-joules-app/report/${reportName}/${id}`,
      formData,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${accessToken}`,
          Accept: "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating record:", error);
    return { error };
  }
}
