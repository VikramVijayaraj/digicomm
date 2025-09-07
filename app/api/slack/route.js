import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { message } = await req.json();

    const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: message,
      }),
    });

    if (!res.ok) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to send message to Slack" }),
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ error: "Internal server error", details: err.message }),
      { status: 500 },
    );
  }
}
