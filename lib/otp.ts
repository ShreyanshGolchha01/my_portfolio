import { readFile, writeFile } from "fs/promises";
import { join } from "path";

type OtpData = {
  code: string;
  expiresAt: number;
};

const otpFilePath = join(process.cwd(), "otp.json");

export async function saveOtp(code: string, expiresInMinutes = 10): Promise<void> {
  const expiresAt = Date.now() + expiresInMinutes * 60 * 1000;
  const data: OtpData = { code, expiresAt };
  await writeFile(otpFilePath, JSON.stringify(data), "utf-8");
}

export async function verifyOtp(inputCode: string): Promise<boolean> {
  try {
    const fileContent = await readFile(otpFilePath, "utf-8");
    const data = JSON.parse(fileContent) as OtpData;
    
    // Check if expired
    if (Date.now() > data.expiresAt) {
      return false;
    }

    // Verify code
    if (data.code === inputCode) {
      return true;
    }

    return false;
  } catch (error) {
    // File might not exist yet
    return false;
  }
}

export async function clearOtp(): Promise<void> {
  try {
    await writeFile(otpFilePath, "{}", "utf-8");
  } catch (error) {
    // Ignore error
  }
}
