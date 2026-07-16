import { NextRequest, NextResponse } from "next/server";
import { getPortfolioData, savePortfolioData } from "@/components/portfolio/data";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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
    
    // Invalidate the cache for the home page so changes show up instantly on production
    revalidatePath("/");
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving data:", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
