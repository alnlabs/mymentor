import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      uid,
      email,
      name,
      photoURL,
      firstName,
      lastName,
      emailVerified,
      phoneNumber,
      locale,
      timezone,
    } = body;

    if (!uid || !email) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Create new user with enhanced profile data
      user = await prisma.user.create({
        data: {
          id: uid,
          email,
          name: name || email.split("@")[0],
          avatar: photoURL,
          provider: "google",
          role: "user",
          // Additional profile fields
          firstName: firstName || name?.split(" ")[0] || "",
          lastName: lastName || name?.split(" ").slice(1).join(" ") || "",
          emailVerified: emailVerified || false,
          phoneNumber: phoneNumber,
          locale: locale || "en",
          timezone: timezone || "UTC",
          // Set default preferences
          preferences: JSON.stringify({
            theme: "light",
            notifications: true,
            language: locale || "en",
          }),
          // Set profile completion status
          profileCompleted: !!(firstName && lastName && photoURL),
        },
      });
    } else {
      // Update existing user's info with new profile data
      user = await prisma.user.update({
        where: { email },
        data: {
          name: name || user.name,
          avatar: photoURL || user.avatar,
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          emailVerified:
            emailVerified !== undefined ? emailVerified : user.emailVerified,
          phoneNumber: phoneNumber || user.phoneNumber,
          locale: locale || user.locale,
          timezone: timezone || user.timezone,
          isActive: true,
          // Update profile completion status
          profileCompleted: !!(firstName && lastName && photoURL),
          // Update last login
          lastLoginAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified,
        phoneNumber: user.phoneNumber,
        locale: user.locale,
        timezone: user.timezone,
        profileCompleted: user.profileCompleted,
        preferences: user.preferences ? JSON.parse(user.preferences) : null,
        lastLoginAt: user.lastLoginAt,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate user" },
      { status: 500 }
    );
  }
}
