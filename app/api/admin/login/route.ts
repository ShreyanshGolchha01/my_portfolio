import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { saveOtp, verifyOtp, clearOtp } from "@/lib/otp";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(otp: string) {
  const { EMAIL_USER, EMAIL_APP_PASSWORD, ADMIN_EMAIL } = process.env;

  if (!EMAIL_USER || !EMAIL_APP_PASSWORD || !ADMIN_EMAIL) {
    throw new Error("Missing email configuration in .env");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: EMAIL_USER,
    to: ADMIN_EMAIL,
    subject: "Vault Login OTP",
    text: `Your OTP for logging into the Vault is: ${otp}\n\nIt expires in 10 minutes.`,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // PHASE 2: OTP Verification
    if (body.otp) {
      const isValid = await verifyOtp(body.otp);
      
      if (!isValid) {
        return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
      }

      await clearOtp(); // Clear it so it can't be reused

      const response = NextResponse.json({ success: true });
      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      });
      return response;
    }

    // PHASE 1: Credentials Check
    const { username, password } = body;
    const expectedUsername = process.env.ADMIN_USERNAME;
    const expectedPassword = process.env.ADMIN_PASSWORD;

    if (!expectedUsername || !expectedPassword) {
      return NextResponse.json({ error: "Server missing admin credentials in .env" }, { status: 500 });
    }

    if (username === expectedUsername && password === expectedPassword) {
      try {
        const otp = generateOtp();
        await saveOtp(otp, 10); // 10 minutes expiry
        await sendOtpEmail(otp);
        return NextResponse.json({ requiresOtp: true });
      } catch (err) {
        console.error("Failed to send OTP email:", err);
        return NextResponse.json({ error: "Failed to send OTP email. Check .env config." }, { status: 500 });
      }
    }

    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
