import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing image URL" }, { status: 400 });
  }

  try {
    // Decode the double-encoded URL
    const decodedUrl = decodeURIComponent(url);

    const response = await axios.get(decodedUrl, {
      responseType: "arraybuffer",
    });

    const headers = new Headers();
    headers.set("Content-Type", response.headers["content-type"]);

    return new NextResponse(Buffer.from(response.data), { headers });
  } catch (error) {
    console.error("Error fetching image:", error);
    return NextResponse.json(
      { error: "Error fetching image" },
      { status: 500 },
    );
  }
}
