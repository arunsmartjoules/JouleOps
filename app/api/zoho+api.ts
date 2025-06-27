import { getRecords, updateRecord } from "@/util/zohoApi";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const report_name = url.searchParams.get("report_name");
    const criteria_params = url.searchParams.get("criteria");

    if (!report_name) {
      return new Response(JSON.stringify({ message: "Missing report_name" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await getRecords(report_name, criteria_params || "");

    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in zoho+api.ts", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
export async function PATCH(request: Request) {
  const body = await request.json();
  const { form_data, report_name, id } = body;

  if (!form_data) {
    return new Response(JSON.stringify({ message: "Missing Payload" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!report_name) {
    return new Response(JSON.stringify({ message: "Missing Report Name" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (!id) {
    return new Response(JSON.stringify({ message: "Missing record ID" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
  try {
    const response = await updateRecord(form_data, report_name, id);
    return new Response(JSON.stringify({ response }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in zoho+api.ts", error);
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
