import { connect } from "@/dbConfig/dbConfig";
import User from '@/models/user.model';
import { NextRequest, NextResponse } from "next/server";

connect()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token } = reqBody;
        console.log(token);

        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: Date.now() } // checking if token expired or not
        })

        if (!user) {
            return NextResponse.json({ error: "Invald token" }, { status: 400 });
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return NextResponse.json({
            message: "Email verified successfully",
            success: true
        }, { status: 500 })

    } catch (error: any) {
        return NextResponse.json({ error: error.message },
            { status: 500 })
    }
}