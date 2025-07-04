import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { connect } from "@/dbConfig/dbConfig";
import jwt from 'jsonwebtoken';


connect();

export const getDataFromToken = (request: NextRequest): string | undefined => {
  try {
    const token = request.cookies.get("token")?.value || '';
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!);

    if (typeof decodedToken !== 'object' || !decodedToken || !('id' in decodedToken)) {
      throw new Error("Invalid token payload");
    }

    return decodedToken.id as string;
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
       const userId =  await getDataFromToken(request);
       const user = await User.findById({_id: userId}).select("-password");
       return NextResponse.json({message: "Found user!", data: user})
    } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(error.message);
          return NextResponse.json({error: error.message}, 
            {status: 400}
        );
        } else {
          console.log("Unknown error occurred:", error);
        }
    }       
}