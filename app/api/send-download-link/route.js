import { NextResponse } from "next/server";
import { sendProductDownloadEmail } from "@/actions/send-email-action";

// POST /api/send-download-link
export async function POST(req) {
  try {
    const { email, productName, downloadUrl } = await req.json();
    const result = await sendProductDownloadEmail({ email, productName, downloadUrl });
    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: result.error });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
