import { NextResponse } from "next/server";
import { calculateStats } from "@/lib/storage";

export async function GET() {
  try {
    const stats = calculateStats('agent-001');
    
    return NextResponse.json({
      totalApplications: stats.totalApplications,
      pending: stats.pending,
      interviews: stats.interviews,
      rejections: stats.rejections,
      offers: stats.offers,
      inReview: stats.inReview,
      noResponse: stats.noResponse,
      successRate: stats.successRate,
    });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    
    // Return demo data if storage is not available
    return NextResponse.json({
      totalApplications: 0,
      pending: 0,
      interviews: 0,
      rejections: 0,
      offers: 0,
      inReview: 0,
      noResponse: 0,
      successRate: 0,
    });
  }
}

