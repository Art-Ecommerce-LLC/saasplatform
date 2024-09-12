import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { db } from '@/app/lib/db'; // Adjust the path to your database

const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: NextRequest) {
  try {
    // Get the token from the query parameters
    const { searchParams } = new URL(req.url);
    const sessionToken = searchParams.get('sessionToken');

    if (!sessionToken) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }

    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(sessionToken, JWT_SECRET);
    } catch (err) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }

    // Extract the userId and email from the decoded token
    const { userId, email, emailLinkTime } = decoded as { userId: string; email: string, emailLinkTime: string };

    // Find the user in the database
    const user = await db.user.findUnique({
      where: { id: userId, email },
    });

    if (!user) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }



    // Check if the email is already verified
    if (user.emailVerified) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }

    // Check that the emailLinkTime in the sessionToken matches the one in the database
    if (new Date(emailLinkTime).getTime() !== user.emailLinkTime!.getTime()) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }

    // Check if emailLinkTime is expired
    const isTokenExpired = new Date().getTime() > new Date(emailLinkTime).getTime() + 5 * 60 * 1000; // 5 minutes

    if (isTokenExpired) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
    }

    // Mark the email as verified
    await db.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() }, // Mark email as verified
    });

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/email-verified`);
  } catch (error) {
    NextResponse.redirect(`${process.env.NEXTAUTH_URL}/invalid-verification`);
  }
}
