import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "@/helpers/getDatafromToken";
import {connect} from "@/dbConfig/dbConfig";
import User from "@/models/userModel";



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

