import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { promises as fs } from "fs";
import path from "path";
import os from "os";

const execFileAsync = promisify(execFile);

function findFFmpeg(): string {
  return path.join(
    process.env.LOCALAPPDATA || "",
    "Microsoft",
    "WinGet",
    "Packages",
    "Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe",
    "ffmpeg-9.0-full_build",
    "bin",
    "ffmpeg.exe"
  );
}

export async function POST(request: NextRequest) {
  let tempDir = "";

  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const bitrate = String(formData.get("bitrate") || "192");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No file uploaded." },
        { status: 400 }
      );
    }

    const allowedBitrates = ["128", "192", "320"];

    if (!allowedBitrates.includes(bitrate)) {
      return NextResponse.json(
        { error: "Invalid bitrate." },
        { status: 400 }
      );
    }

    const maxFileSize = 200 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 200 MB." },
        { status: 400 }
      );
    }

    const ffmpegPath = findFFmpeg();

    try {
      await fs.access(ffmpegPath);
    } catch {
      return NextResponse.json(
        {
          error:
            "FFmpeg was not found. Please check the FFmpeg installation.",
        },
        { status: 500 }
      );
    }

    tempDir = await fs.mkdtemp(
      path.join(os.tmpdir(), "exactkb-audio-")
    );

    const inputPath = path.join(
      tempDir,
      `input-${Date.now()}`
    );

    const outputPath = path.join(
      tempDir,
      `output-${Date.now()}.mp3`
    );

    const inputBuffer = Buffer.from(
      await file.arrayBuffer()
    );

    await fs.writeFile(inputPath, inputBuffer);

    await execFileAsync(
      ffmpegPath,
      [
        "-y",
        "-i",
        inputPath,
        "-vn",
        "-codec:a",
        "libmp3lame",
        "-b:a",
        `${bitrate}k`,
        "-ar",
        "44100",
        outputPath,
      ],
      {
        windowsHide: true,
        maxBuffer: 10 * 1024 * 1024,
      }
    );

    const outputBuffer = await fs.readFile(outputPath);

    const originalName =
      file.name.replace(/\.[^/.]+$/, "") || "audio";

    return new NextResponse(outputBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="${originalName}.mp3"`,
        "Content-Length": outputBuffer.length.toString(),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Audio conversion error:", error);

    return NextResponse.json(
      {
        error:
          "Audio conversion failed. Please check the uploaded file and try again.",
      },
      { status: 500 }
    );
  } finally {
    if (tempDir) {
      try {
        await fs.rm(tempDir, {
          recursive: true,
          force: true,
        });
      } catch {
        // Ignore cleanup errors.
      }
    }
  }
}