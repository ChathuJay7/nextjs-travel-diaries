
import FeedbackModel from "@/app/models/Feedback";
import mongoose from "mongoose"
import { NextResponse } from "next/server";

export async function POST(req) {

    const feedback = await req.json();
    const { title, description, uploadImages } = feedback;

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    await FeedbackModel.create({ title, description, images:uploadImages })

    return NextResponse.json({ message: "Feedback added", data: feedback }, { status: 201 })
}

export function GET() {
    return Response.json('test roye')
}