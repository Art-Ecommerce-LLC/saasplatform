import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
    // Retrieve the user data from the request or session
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ message: "Email is required" }, { status: 400 });
        }
    
        // Find the user in the database by email
        const user = await db.user.findUnique({
            where: { email },
        });
    
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
    
    
        // Create session token with the email and userId
        const sessionToken = jwt.sign(
            { userId: user.id, email },
            JWT_SECRET,
            { expiresIn: "15m" }
        );
    
        // Send email verification link
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    
        const passwordResetLink = `${process.env.NEXTAUTH_URL}/reset-password?sessionToken=${sessionToken}`;
    
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: email,
            subject: "Password Reset",
            text: `Click the link to reset your password: ${passwordResetLink}`,
        });
    
        return NextResponse.json({ sessionToken: sessionToken });
    
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

}