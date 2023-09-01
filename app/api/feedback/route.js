
import FeedbackModel from "@/app/models/Feedback";
import mongoose from "mongoose"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {

    const feedback = await req.json();
    const { title, description, uploadImages } = feedback;

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)
    const userEmail = session.user.email;

    const feedbackCreated = await FeedbackModel.create({ title, description, images:uploadImages, userEmail })

    // return NextResponse.json({ message: "Feedback added", data: feedback }, { status: 201 })
    return NextResponse.json(feedbackCreated)
}


export async function GET() {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const feedbacks = await FeedbackModel.find();
    return NextResponse.json({ feedbacks });
}