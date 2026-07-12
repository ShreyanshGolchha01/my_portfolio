import { readFile } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const filePath = join(process.cwd(), "public", "Shreyansh Resume.pdf");
    const fileContent = await readFile(filePath);

    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Shreyansh Resume.pdf"',
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Resume file error:", error);
    return NextResponse.json(
      { error: "Resume not found" },
      { status: 404 }
    );
  }
}
