import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db'; // Adjust this path to your db
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { encrypt } from '@/app/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    console.log('User:', user);

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Compare password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password!);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // If the credentials are valid, return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;



    // Generate a 6-digit OTP
    const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

    const otp = generateOTP();
    console.log(`Generated OTP: ${otp} for email: ${email}`);
    // Store otp and email in db
     // Store OTP in the database using Prisma's upsert function
     try {
      await db.oTP.upsert({
        where: { email: normalizedEmail },
        update: {
          otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
        create: {
          email: normalizedEmail,
          otp: otp,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
        },
      });
      console.log('OTP successfully upserted into the database.');
    } catch (error) {
      console.error('Error inserting OTP into database:', error);
      return NextResponse.json({ error: 'Failed to generate OTP' }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
    });

    await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: normalizedEmail,
    subject: "Your OTP for Authentication",
    text: `Your OTP is: ${otp}`,
    html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    });

    // Create an encrypted session token with the userId and email
    const sessionToken = encrypt(JSON.stringify({ userId: user.id, email: user.email }));
    return NextResponse.json({ user: userWithoutPassword, sessionToken: sessionToken });
  } catch (error) {
    console.error('Error handling login:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}