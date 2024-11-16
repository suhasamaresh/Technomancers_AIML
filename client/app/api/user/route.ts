import { NextResponse } from "next/server";
import prisma from "@/app/lib/db";
import { hash } from "bcrypt";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password,name, resumeUrl, techStack, interests } = body;

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if(existingUser) {
            return NextResponse.json({ user: null, message: "User already exists" });
        }

        const hashedPassword = await hash(password, 10);
        const newuser = await prisma.user.create({
            data: {
                email:email,
                password: hashedPassword,
                name: name, // Replace with actual name
                resumeUrl: resumeUrl, // Replace with actual resume URL
                techStack: techStack, // Replace with actual tech stack
                interests: interests // Replace with actual interests
            }
        });
        return NextResponse.json({ user: newuser, message: "User created successfully" });
    } catch (error) {
        return NextResponse.json({ user: null, message: "Error creating user" });
    }
}

export async function GET(req: Request) {
    try {
        const users = await prisma.user.findMany();
        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json({ users: [] });
    }
}