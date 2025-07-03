import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";

// Helper to get user ID from token
export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);

    if (typeof decodedToken !== 'object' || !decodedToken || !('email' in decodedToken)) {
      throw new Error("Invalid token payload");
    }

    return decodedToken.id;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("Unknown error:", error);
    }
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
  } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
}

