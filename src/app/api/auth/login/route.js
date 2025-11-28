import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    console.log('🔐 Login request received');
    
    await dbConnect();
    console.log('✅ Database connected');

    const { email, password } = await request.json();
    
    // ✅ Clean input
    const cleanEmail = email?.trim().toLowerCase();
    const cleanPassword = password?.trim();
    
    console.log('📧 Login attempt for:', cleanEmail);

    // ✅ Validate input
    if (!cleanEmail || !cleanPassword) {
      console.log('❌ Missing email or password');
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    // ✅ Find user with password field
    console.log('🔍 Searching for user...');
    const user = await User.findOne({ email: cleanEmail }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log('👤 User found:', user.username);
    console.log('🔒 Password field exists:', !!user.password);

    if (!user.password) {
      console.log('❌ Password field missing in database');
      return NextResponse.json(
        { success: false, message: "Account error. Please contact support." },
        { status: 500 }
      );
    }

    // ✅ Compare password using model method
    console.log('🔍 Comparing passwords...');
    const isPasswordValid = await user.comparePassword(cleanPassword);
    
    console.log('✅ Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 }
      );
    }

    console.log('✅ Password validated successfully!');

    // ✅ Generate JWT
    console.log('🎫 Generating JWT token...');
    
    if (!process.env.JWT_SECRET) {
      console.error('❌ JWT_SECRET not configured');
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.username,
        accountType: user.accountType
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log('✅ JWT token generated');

    // ✅ Prepare response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        accountType: user.accountType,
        profilePhoto: user.profilePhoto,
        isVerified: user.isVerified
      }
    });

    // ✅ Set HTTP-Only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
    });

    console.log('✅ Cookie set successfully');
    console.log('✅✅✅ LOGIN SUCCESSFUL ✅✅✅');
    console.log('👤 User:', user.username);
    console.log('📧 Email:', user.email);
    console.log('🎭 Account Type:', user.accountType);

    return response;
    
  } catch (error) {
    console.error('❌❌❌ LOGIN ERROR ❌❌❌');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Server error during login",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}