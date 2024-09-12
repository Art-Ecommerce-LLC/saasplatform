import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from '@/app/lib/utils';
import { db } from '@/app/lib/db';  // Adjust the path to your database

export async function POST(req: NextRequest) {
  try {
    const { OTP, sessionToken } = await req.json();
    // Ensure OTP and sessionToken are provided
    if (!OTP || !sessionToken) {
      return NextResponse.json({ error: 'OTP and session token are required' }, { status: 400 });
    }

    // Decrypt the session token
    let sessionData;
    try {
      sessionData = decrypt(sessionToken);  // Decrypt sessionToken to get session data (e.g., userId, email)
    } catch (error) {
      return NextResponse.json({ error: 'Invalid session token' }, { status: 400 });
    }

    const { userId, email } = JSON.parse(sessionData);
      // Ensure OTP is provided
    if (!OTP) {
      return NextResponse.json({ error: 'OTP is required' }, { status: 400 });
    }

    // Query the OTP from the database where OTP matches and it hasn't expired
    const storedOTP = await db.oTP.findFirst({
      where: {
        otp: OTP,
        expiresAt: {
          gt: new Date(), // Only get OTPs that haven't expired
        },
      },
    });



    if (!OTP || !email) {
      return NextResponse.json({ error: 'OTP and email are required' }, { status: 400 });
    }
  
    if (!storedOTP) {
    return NextResponse.json({ error: 'OTP not found' }, { status: 400 });
    }

    if (new Date() > storedOTP.expiresAt) {
    await db.oTP.delete({ where: { email } });
    return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }

    if (OTP !== storedOTP.otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
  
    // Mark the user as MFA-verified (or logged in, based on your flow)
    await db.user.update({
      where: { id: userId },  // Use userId from the decrypted session data
      data: { mfaVerified: true },  // Example: Set MFA verified flag to true
    });

    return NextResponse.json({ sessionToken: sessionToken, OTP: OTP}, { status: 200 });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
