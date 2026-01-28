import { NextRequest, NextResponse } from "next/server";
import { getActivityLogs, addActivityLog } from "@/lib/storage";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "50");

  try {
    const activities = getActivityLogs(limit);
    return NextResponse.json(activities);
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agentId, type, message, details } = body;

    const activity = addActivityLog({
      agentId: agentId || 'agent-001',
      type,
      message,
      details,
      timestamp: new Date()
    });

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Failed to create activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity" },
      { status: 500 }
    );
  }
}

