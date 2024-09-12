import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db'; // Adjust the path to your database
import nodemailer from 'nodemailer';
import {encrypt, decrypt } from '@/app/lib/utils'; // Adjust the path to your crypto file

export async function POST(req: NextRequest) {
  try {
    // Retrieve the user data from the request or session
    const { sessionToken } = await req.json();

    if (!sessionToken) {
      return NextResponse.json({ message: 'Email is required' }, { status: 400 });
    }

    // Decrypt the data
    const decryptedData = decrypt(decodeURIComponent(sessionToken));
    const { userId, email } = JSON.parse(decryptedData);
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

    const newSessionToken = encrypt(JSON.stringify({ userId, email, emailLinkTime }));
    const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?sessionToken=${encodeURIComponent(newSessionToken)}`;

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
