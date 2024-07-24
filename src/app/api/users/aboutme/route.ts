import { connect } from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import { getTokenData } from "@/utils/getTokenData";
import User from "@/models/user.model";

connect();

export async function POST(request: NextRequest) {
    //extract data from token
    const userID = await getTokenData(request);
    const user = await User.findOne({ _id: userID }).select("-password");

    if (!user) {
        return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    return NextResponse.json({
        message: "User found",
        data: user
    })
}