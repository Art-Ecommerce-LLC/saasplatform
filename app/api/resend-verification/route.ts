import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db'; // Adjust the path to your database
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // Make sure this is set in your environment

export async function POST(req: NextRequest) {
  try {
    // Retrieve the user data from the request or session
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    let decoded;
    try {
      decoded = jwt.verify(sessionToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 });
    }

    // Extract the userId and email from the decoded token
    const { userId, email } = decoded as { userId: string; email: string };
    email
    const emailLinkTime = new Date();

    await db.user.update({
      where: { id: userId },
      data: { emailLinkTime: emailLinkTime },
    });

    // Find the user in the database by email
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ message: 'Email is already verified' }, { status: 400 });
    }

    // Resend the verification email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Reset the emailLinkTime in the sessionToken

    const newSessionToken = jwt.sign(
      { userId, email, emailLinkTime },
      JWT_SECRET,
      { expiresIn: '15m' }
    );


    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?sessionToken=${newSessionToken}`;
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Email Verification",
        text: `Click here to verify your email: ${verificationUrl}`,
        html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`,
        });

    return NextResponse.json({ message: 'Verification email sent' }, { status: 200 });
  } catch (error) {
    console.error('Error resending verification email:', error);
    return NextResponse.json({ message: 'Failed to resend verification email' }, { status: 500 });
  }
}
