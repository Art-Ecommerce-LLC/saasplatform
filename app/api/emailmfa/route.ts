// app/api/emailmfa/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { db } from '@/app/lib/db'; // Adjust this path to your db

export async function POST(req: NextRequest) {
  try {
    const { otp } = await req.json();

    // Ensure OTP is provided
    if (!otp) {
        return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
      }
  
      // Query the OTP from the database where OTP matches and it hasn't expired
      const storedOtp = await db.oTP.findFirst({
        where: {
          otp: otp,
          expiresAt: {
            gt: new Date(), // Only get OTPs that haven't expired
          },
        },
      });


    // Retrieve the email associated with the OTP
    const email = storedOtp?.email;

    // Fetch the user from the database based on the email
    const user = await db.user.findUnique({
      where: { email },
    });


    if (!otp || !email) {
      return NextResponse.json({ error: 'OTP and email are required' }, { status: 400 });
    }
  
    if (!storedOtp) {
    return NextResponse.json({ error: 'OTP not found' }, { status: 400 });
    }

    if (new Date() > storedOtp.expiresAt) {
    await db.oTP.delete({ where: { email } });
    return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (otp !== storedOtp.otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    // Mark MFA as verified
    await db.user.update({
    where: { email },
    data: { mfaVerified: true },
    });

    // Clean up OTP after use
    await db.oTP.delete({ where: { email } });
    
    return NextResponse.json({ user }, { status: 200 });
} catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
}
}
