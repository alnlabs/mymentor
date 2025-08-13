import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// GET - Get metadata for all categories or specific category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const metadataDir = path.join(process.cwd(), "data", "seeds", "metadata");

    if (category) {
      // Get specific category metadata
      const categoryFile = path.join(metadataDir, `${category}.json`);
      if (!fs.existsSync(categoryFile)) {
        return NextResponse.json(
          { success: false, error: "Category metadata not found" },
          { status: 404 }
        );
      }

      const metadata = JSON.parse(fs.readFileSync(categoryFile, "utf8"));
      return NextResponse.json({
        success: true,
        data: metadata,
      });
    } else {
      // Get master metadata
      const masterFile = path.join(metadataDir, "master.json");
      if (!fs.existsSync(masterFile)) {
        return NextResponse.json(
          { success: false, error: "Master metadata not found" },
          { status: 404 }
        );
      }

      const masterMetadata = JSON.parse(fs.readFileSync(masterFile, "utf8"));

      // Also get individual category metadata
      const categoryFiles = fs
        .readdirSync(metadataDir)
        .filter((file) => file.endsWith(".json") && file !== "master.json");

      const categories = [];
      for (const file of categoryFiles) {
        const categoryName = file.replace(".json", "");
        const categoryPath = path.join(metadataDir, file);
        const categoryData = JSON.parse(fs.readFileSync(categoryPath, "utf8"));
        categories.push(categoryData);
      }

      return NextResponse.json({
        success: true,
        data: {
          master: masterMetadata,
          categories: categories,
        },
      });
    }
  } catch (error: any) {
    console.error("Error fetching metadata:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch metadata" },
      { status: 500 }
    );
  }
}

// PUT - Update metadata for a category
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, metadata } = body;

    if (!category || !metadata) {
      return NextResponse.json(
        { success: false, error: "Category and metadata are required" },
        { status: 400 }
      );
    }

    const metadataDir = path.join(process.cwd(), "data", "seeds", "metadata");
    const categoryFile = path.join(metadataDir, `${category}.json`);

    // Update lastUpdated timestamp
    metadata.lastUpdated = new Date().toISOString().split("T")[0];

    fs.writeFileSync(categoryFile, JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        message: `Metadata updated for ${category}`,
        metadata: metadata,
      },
    });
  } catch (error: any) {
    console.error("Error updating metadata:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update metadata" },
      { status: 500 }
    );
  }
}
