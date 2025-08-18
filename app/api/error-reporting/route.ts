import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";

interface ErrorReport {
  errorId: string;
  message: string;
  stack?: string;
  componentStack?: string;
  componentName: string;
  timestamp: string;
  userAgent: string;
  url: string;
  userId?: string;
  sessionId?: string;
}

export async function POST(request: NextRequest) {
  try {
    const errorReport: ErrorReport = await request.json();

    // Validate required fields
    if (!errorReport.message || !errorReport.timestamp) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In development, just log the error
    if (process.env.NODE_ENV === "development") {
      console.error("Error Report Received:", errorReport);
      return NextResponse.json({ success: true, message: "Error logged" });
    }

    // In production, you might want to:
    // 1. Store in database
    // 2. Send to external error tracking service (Sentry, LogRocket, etc.)
    // 3. Send notifications to developers
    // 4. Rate limit error reports

    // For now, we'll just log it and potentially store in database
    console.error("Production Error Report:", {
      errorId: errorReport.errorId,
      message: errorReport.message,
      componentName: errorReport.componentName,
      url: errorReport.url,
      timestamp: errorReport.timestamp,
    });

    // Optional: Store in database for analysis
    // Uncomment the following code if you want to store errors in database
    /*
    try {
      await prisma.errorLog.create({
        data: {
          errorId: errorReport.errorId,
          message: errorReport.message,
          stack: errorReport.stack || null,
          componentStack: errorReport.componentStack || null,
          componentName: errorReport.componentName,
          userAgent: errorReport.userAgent,
          url: errorReport.url,
          userId: errorReport.userId || null,
          timestamp: new Date(errorReport.timestamp),
        },
      });
    } catch (dbError) {
      console.error("Failed to store error in database:", dbError);
      // Don't fail the request if database storage fails
    }
    */

    // Optional: Send to external error tracking service
    // Example with Sentry:
    /*
    if (process.env.SENTRY_DSN) {
      try {
        const Sentry = require('@sentry/nextjs');
        Sentry.captureException(new Error(errorReport.message), {
          tags: {
            component: errorReport.componentName,
            errorId: errorReport.errorId,
          },
          extra: {
            stack: errorReport.stack,
            componentStack: errorReport.componentStack,
            url: errorReport.url,
            userAgent: errorReport.userAgent,
          },
        });
      } catch (sentryError) {
        console.error("Failed to send error to Sentry:", sentryError);
      }
    }
    */

    return NextResponse.json({
      success: true,
      message: "Error report received",
      errorId: errorReport.errorId,
    });
  } catch (error) {
    console.error("Error processing error report:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to process error report",
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to retrieve error statistics
export async function GET(request: NextRequest) {
  try {
    // Only allow in development or for admin users
    if (process.env.NODE_ENV !== "development") {
      return NextResponse.json(
        { success: false, error: "Not authorized" },
        { status: 403 }
      );
    }

    // Return error statistics
    // This would typically query your error tracking service or database
    const stats = {
      totalErrors: 0,
      recentErrors: [],
      topComponents: [],
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error("Error retrieving error statistics:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve error statistics",
      },
      { status: 500 }
    );
  }
}
