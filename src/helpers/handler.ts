import { NextRequest, NextResponse } from "next/server";
import { getDataFromToken } from "./getDatafromToken";
import User from "@/models/userModel";

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