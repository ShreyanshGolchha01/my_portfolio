import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";
import { getPortfolioData, savePortfolioData } from "@/components/portfolio/data";

function isAuthenticated(request: NextRequest) {
  return request.cookies.get("admin_auth")?.value === "true";
}

export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const type = formData.get("type") as string; // 'resume' or 'photo'
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let fileName = "";
    if (type === "resume") {
      fileName = "Shreyansh Resume.pdf";
    } else if (type === "photo") {
      // Get extension from the file type or name
      const ext = file.name.split('.').pop() || "jpg";
      fileName = `photo.${ext}`;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    const filePath = join(process.cwd(), "public", fileName);
    await writeFile(filePath, buffer);

    if (type === "photo") {
      const data = await getPortfolioData();
      data.photoUrl = `/${fileName}?v=${Date.now()}`;
      await savePortfolioData(data);
    } else if (type === "resume") {
      const data = await getPortfolioData();
      data.resumeUrl = `/resume?v=${Date.now()}`;
      await savePortfolioData(data);
    }

    return NextResponse.json({ success: true, fileName });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
  }
}
