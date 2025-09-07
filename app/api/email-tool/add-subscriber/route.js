import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, name } = await req.json();

  try {
    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email: email,
          fields: {
            name: name,
          },
          status: "active", // or "unconfirmed" if you want double opt-in
        }),
      },
    );

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
