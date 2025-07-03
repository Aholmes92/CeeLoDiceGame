import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

// Helper: Extract user ID from JWT in cookie
const getUserIdFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || '';
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET!);
    
    if (typeof decoded !== 'object' || !decoded || !('email' in decoded)) {
    throw new Error("Invalid token payload");
    }
    
    return decoded.id;
  
  } catch (err) {
    throw new Error("Invalid or missing token");
  }
};

export async function POST(request: NextRequest) {
  try {
    await connect();

    const userId = getUserIdFromToken(request);
    const { wins, games } = await request.json();

    if (typeof wins !== 'number' || typeof games !== 'number') {
      return NextResponse.json({ message: 'Invalid input types' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          gamesPlayed: games,
          gamesWon: wins
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Stats synced successfully',
      gamesPlayed: updatedUser.gamesPlayed,
      gamesWon: updatedUser.gamesWon,
    });

  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
    } else {
      console.error("Unknown error:", err);
    }
  }
}
