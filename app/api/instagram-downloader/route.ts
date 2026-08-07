import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const url =
      typeof body?.url === "string"
        ? body.url.trim()
        : "";

    if (!url) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter an Instagram URL.",
        },
        { status: 400 }
      );
    }

    let instagramUrl: URL;

    try {
      instagramUrl = new URL(url);
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid Instagram URL.",
        },
        { status: 400 }
      );
    }

    const hostname = instagramUrl.hostname.toLowerCase();

    if (
      hostname !== "instagram.com" &&
      hostname !== "www.instagram.com"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Only Instagram URLs are supported.",
        },
        { status: 400 }
      );
    }

    const pathname = instagramUrl.pathname;

    const supported =
      pathname.startsWith("/reel/") ||
      pathname.startsWith("/p/") ||
      pathname.startsWith("/tv/");

    if (!supported) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Please enter a public Instagram Reel, post, or IGTV URL.",
        },
        { status: 400 }
      );
    }

    const token = process.env.APIFY_API_TOKEN;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Instagram downloader is not configured yet.",
        },
        { status: 500 }
      );
    }

    const endpoint =
      "https://api.apify.com/v2/acts/elis~instagram-downloader-api/run-sync-get-dataset-items";

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        url: [url],
      }),
      cache: "no-store",
    });

    const responseText = await response.text();

    let data: any;

    try {
      data = JSON.parse(responseText);
    } catch {
      console.error(
        "Apify returned invalid JSON:",
        responseText
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Instagram service returned an invalid response.",
        },
        { status: 502 }
      );
    }

    console.log("Apify result:", data);

    if (!response.ok) {
      console.error("Apify error:", data);

      return NextResponse.json(
        {
          success: false,
          error:
            data?.error?.message ||
            data?.message ||
            "Unable to process this Instagram URL.",
        },
        { status: 502 }
      );
    }

    const items = Array.isArray(data)
      ? data
      : [];

    if (items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No media was found. Make sure the Instagram content is public.",
        },
        { status: 404 }
      );
    }

    const firstItem = items[0];

    const results = Array.isArray(firstItem?.result)
      ? firstItem.result
      : [];

    const videos = results.filter(
      (item: any) =>
        item &&
        typeof item.url === "string" &&
        item.type === "video"
    );

    if (videos.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No downloadable video was found for this Instagram URL.",
        },
        { status: 404 }
      );
    }

    const hd =
      videos.find(
        (video: any) =>
          String(video.quality || "").toUpperCase() === "HD"
      ) || videos[0];

    return NextResponse.json({
      success: true,
      downloadUrl: hd.url,
      quality: hd.quality || "HD",
      size: hd.size || null,
      thumbnail: hd.thumb || null,
    });
  } catch (error) {
    console.error(
      "Instagram downloader error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}