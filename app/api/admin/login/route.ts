import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { saveOtp, verifyOtp, clearOtp } from "@/lib/otp";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOtpEmail(otp: string) {
  const { RESEND_API_KEY, ADMIN_EMAIL } = process.env;

  if (!RESEND_API_KEY || !ADMIN_EMAIL) {
    throw new Error("Missing RESEND_API_KEY or ADMIN_EMAIL in .env");
  }

  const resend = new Resend(RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Vault <onboarding@resend.dev>",
    to: [ADMIN_EMAIL],
    subject: "Vault Access Request - Verification Code",
    text: `Your OTP for logging into the Vault is: ${otp}\n\nIt expires in 10 minutes. If you did not request this, please ignore this email.`,
    html: `
      <div style="font-family: 'Courier New', Courier, monospace; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #3a3528; border-radius: 16px; background-color: #0e0c09; color: #e6e2d3;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 213, 79, 0.1); border: 1px solid rgba(255, 213, 79, 0.3); border-radius: 20px; color: #ffd54f; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">
            System Notification
          </span>
        </div>
        <h2 style="color: #e6e2d3; margin-top: 0; margin-bottom: 16px; font-weight: 500; font-size: 22px; text-align: center;">Vault Access Required</h2>
        <p style="color: #9a9486; font-size: 14px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          Initiating secure access protocol. Please use the following one-time password to complete your login sequence.
        </p>
        <div style="background: linear-gradient(135deg, rgba(10, 8, 6, 0.26) 0%, rgba(22, 20, 15, 0.35) 100%); padding: 24px; text-align: center; border-radius: 12px; margin: 32px 0; border: 1px solid rgba(255, 213, 79, 0.2); box-shadow: 0 0 20px rgba(255, 213, 79, 0.05);">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #ffd54f; text-shadow: 0 0 12px rgba(255, 213, 79, 0.3);">${otp}</span>
        </div>
        <p style="color: #9a9486; font-size: 12px; line-height: 1.6; text-align: center; margin-bottom: 32px;">
          <strong style="color: #ffd54f; font-weight: normal;">SESSION_TIMEOUT = 10 MINUTES</strong><br><br>
          If this request was not initiated by you, abort and ignore this transmission.
        </p>
        <hr style="border: none; border-top: 1px dashed #3a3528; margin: 0 0 24px 0;" />
        <p style="color: #a5a5a5ff; font-size: 10px; text-align: center; margin: 0; text-transform: uppercase; letter-spacing: 2px;">
          Shreyansh Golchha - Vault Access
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
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
