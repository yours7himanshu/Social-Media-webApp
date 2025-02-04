import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

import User from "@/models/User";

// if making POST request then naming should be exactly like this its just like NEXT.js syntax
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        {
          error: "Email and password are required",
        },
        {
          status: 400,
        }
      );
    }
    await connectToDatabase();
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        {
          error: "Email already registred",
        },
        { status: 400 }
      );
    }

    await User.create({
      email,
      password,
    });
    return NextResponse.json(
      {
        message: "User registered Successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({error:"Failed to register User"},{status:500})
  }
}
