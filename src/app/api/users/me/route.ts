import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

// Helper to get user ID from token
const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || '';
    const decodedToken: any = jwt.verify(token, process.env.TOKEN_SECRET!);
    return decodedToken.id;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export async function GET(request: NextRequest) {
  try {
    await connect();

    const userId = getDataFromToken(request);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await User.findById(userId).select("username gamesPlayed gamesWon");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

