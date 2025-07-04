import { NextRequest } from "next/server";
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
