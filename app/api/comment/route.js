import CommentModel from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)
    const { email } = session.user

    const comment = await req.json()
    const { text, uploadImages, feedbackId } = comment
    
    const commentCreated = await CommentModel.create({ text, images:uploadImages, userEmail: email, feedbackId })
    return NextResponse.json({ message: "Coment added", commentCreated }, { status: 201 })
    
}