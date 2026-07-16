import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/components/portfolio/data";

function isAuthenticated(request: NextRequest) {
  return request.cookies.get("admin_auth")?.value === "true";
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getPortfolioData();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await request.json();
    await savePortfolioData(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
