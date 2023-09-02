
import FeedbackModel from "@/app/models/Feedback";
import mongoose from "mongoose"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/app/models/User";

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


export async function GET(req) {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const url = new URL(req.url)
    if(url.searchParams.get('id')) {
        const feedback = await FeedbackModel.findById(url.searchParams.get('id'))
        return NextResponse.json(feedback);
        // return NextResponse.json(
        //     await FeedbackModel.findById(url.searchParams.get('id'))
        // );
    } else {
        const feedbacks = await FeedbackModel.find().populate('user');
        return NextResponse.json({ feedbacks });
    }
    
}

export async function PUT(req) {

    const feedback = await req.json();
    const { id, title, description, uploadImages } = feedback;

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json(false);
    }

    const feedbackUpdated = await FeedbackModel.updateOne(
        {_id: id, userEmail: session.user.email},
        {
            title,
            description,
            images: uploadImages
        }

    )

    return NextResponse.json(feedbackUpdated)
}