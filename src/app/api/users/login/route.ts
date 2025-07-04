//file for api routing

import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const {email, password} = reqBody;
        console.log(reqBody); 

        //check if user exists
        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User does not exist"}, {status: 400})
        }

        //check if password is correct
        const validPassword = await bcrypt.compare(password, user.password)
        if(!validPassword){
            return NextResponse.json({error: "Invalid password"}, {status: 400})
        }

        //create token data and token to send to users cookies
        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email
        }

        const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!,
            {expiresIn: "1d"})

        const response = NextResponse.json({
            message: "Success!",
            success: true,
        })
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        })
        return response;
        
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Unknown error:', error);
            }
        }
}