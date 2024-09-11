import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { hash} from "bcrypt";
import * as z from "zod";


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
        
        // Create a new user
        const hashedPassword = await hash(password, 10);
        const newUser = await db.user.create({
            data: {
                email: normalizedEmail, 
                username: normalizedUsername, 
                password: hashedPassword
            }
        })

        const {password:newUserPassword,...rest} = newUser;

        return NextResponse.json({user:rest, message:"User created successfully"}, {status:201})
    } catch (error) {
        return NextResponse.json({message:"Something Went Wrong"}, {status:500})
    }
}