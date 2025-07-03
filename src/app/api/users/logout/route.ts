import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = NextResponse.json({
            message: "You've logged out",
            success: true,
        })
        response.cookies.set("token", "",
            { 
                httpOnly: true, 
                expires: new Date(0)
            });
        return response;
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);
        } else {
            console.error('Unknown error:', error);
        }
    }
}