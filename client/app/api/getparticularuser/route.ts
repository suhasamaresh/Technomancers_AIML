import prisma from "@/app/lib/db";
import { NextResponse } from "next/server";

// This is a GET request handler
export async function GET(req: Request) {
  try {
    // Extract the email from the URL query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Fetch user details from the database
    const user = await prisma.user.findUnique({
      where: {
        email: email, // Use the email from the query string to find the user
      },
    });

    // If the user is not found, return a 404 response
    if (!user) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // Return the user details
    return NextResponse.json({ user });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


export async function PUT(req: Request) {
  try {
    // Extract the email from the URL query parameters
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Extract the updated user data from the request body
    const body = await req.json();
    const { name, resumeUrl, techStack, interests } = body;

    // Update the user details in the database
    const updatedUser = await prisma.user.update({
      where: {
        email: email, // Use the email from the query string to find the user
      },
      data: {
        name: name,
        resumeUrl: resumeUrl,
        techStack: techStack,
        interests: interests,
      },
    });

    // Return the updated user details
    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
