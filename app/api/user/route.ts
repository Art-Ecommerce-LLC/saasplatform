import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { hash} from "bcrypt";
import * as z from "zod";
import { headers } from 'next/headers';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET!;

// Define a schema for input Validation
const userSchema = z
  .object({
    username: z.string().min(1, 'Username is required').max(100),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must have than 8 characters'),
})

const IP = (): string => {
    const FALLBACK_IP_ADDRESS = '0.0.0.0';
    const forwardedFor = headers().get('x-forwarded-for');
    
    if (forwardedFor) {
      return forwardedFor.split(',')[0] ?? FALLBACK_IP_ADDRESS;
    }
    
    return headers().get('x-real-ip') ?? FALLBACK_IP_ADDRESS;
  };

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, username, password } = userSchema.parse(body);

        // Normalize email and username to lowercase
        const normalizedEmail = email.toLowerCase();
        const normalizedUsername = username.toLowerCase();

        // Check if email already exists
        const existingUserByEmail = await db.user.findUnique({
            where: {email:normalizedEmail}
        })

        if (existingUserByEmail) {
            return NextResponse.json({user:null, message:"User with this email already exists"}, {status:409})
        }

        // Check if email already exists
        const existingUserByUsername = await db.user.findUnique({
            where: {username : normalizedUsername}
        })

        if (existingUserByUsername) {
            return NextResponse.json({user:null, message:"User with this username already exists"}, {status:409})
        }

        // Get the user ip address
        const ipAddress = IP();
        // Generate a session token (JWT) that includes the userId and email
  
        
        // Create a new user
        const hashedPassword = await hash(password, 10);
        const emailLinkTime = new Date();
        const newUser = await db.user.create({
            data: {
                email: normalizedEmail, 
                username: normalizedUsername, 
                password: hashedPassword,
                ipAddress: ipAddress,
                updatedAt: new Date(),
                createdAt: new Date(),
                emailLinkTime: emailLinkTime
            }
        })
        const sessionToken = jwt.sign(
            { userId: newUser.id, email: newUser.email, emailLinkTime: emailLinkTime },
            JWT_SECRET,
            { expiresIn: '15m' } // Token will expire in 15 minutes
        );
        // Send email verification link

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
            });

        const verificationUrl = `${process.env.NEXTAUTH_URL}/api/verify-email?sessionToken=${sessionToken}`;
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: normalizedEmail,
            subject: "Email Verification",
            text: `Click here to verify your email: ${verificationUrl}`,
            html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email</p>`,
            });
    

        // const {password:newUserPassword, ...rest} = newUser;

        return NextResponse.json({sessionToken:sessionToken, message:"User created successfully"}, {status:201})
    } catch (error) {
        return NextResponse.json({message:"Something Went Wrong"}, {status:500})
    }
}