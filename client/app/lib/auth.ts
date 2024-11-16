import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials';
import db from "./db";
import bcrypt from 'bcrypt';
import { User } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: Number;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

declare module 'next-auth' {
    interface User {
        id: Number;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/login',
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Email", type: "text", placeholder: "Enter a Valid email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req): Promise<User | null> {
                if (!credentials?.username || !credentials?.password) {
                    return null;
                }
                const user = await db.user.findUnique({
                    where: {
                        email: credentials.username
                    }
                });
                if (!user) {
                    console.log('User not found');
                    return null;
                }
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    console.log('Invalid password');
                    return null;
                }
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    resumeUrl: user.resumeUrl,
                    techStack: user.techStack,
                    interests: user.interests,
                    relevanceScore: user.relevanceScore,
                    roadmap: user.roadmap,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = Number(token.id);
                session.user.name = token.name;
                session.user.email = token.email;
            }
            return session;
        }
    }
};
