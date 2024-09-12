import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/db'; // Adjust this path to your db
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const normalizedEmail = email.toLowerCase();
    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

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

    if (!user.emailVerified) {
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email},
        JWT_SECRET,
        { expiresIn: '15m' } // Token will expire in 15 minutes
    );
      return NextResponse.json({ user: userWithoutPassword, sessionToken: sessionToken });
    }

    const generateOTP = () => {
        return Math.floor(100000 + Math.random() * 900000).toString(); // Ensures a 6-digit number
        };

        // Usage in your authorize function
        const otp = generateOTP();

        // Store otp and email in db
        await db.oTP.upsert({
        where: { email: normalizedEmail },
        update: {
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        },
        create: {
            email: normalizedEmail,
            otp: otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
        }
        });

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



    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Error handling login:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}