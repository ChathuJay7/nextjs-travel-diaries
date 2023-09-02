import CommentModel from "@/app/models/Comment";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import User from "@/app/models/User";

export async function POST(req) {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)
    const { email } = session.user
    if(!session) {
        return NextResponse.json(false)
    }

    const comment = await req.json()
    const { text, uploadImages, feedbackId } = comment
    
    const commentCreated = await CommentModel.create({ text, images:uploadImages, userEmail: email, feedbackId })
    return NextResponse.json({ message: "Coment added", commentCreated }, { status: 201 })
    
}

export async function GET(req) {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const url = new URL(req.url)

    if(url.searchParams.get('feedbackId')) {
        const feedbackId = url.searchParams.get('feedbackId')

        const comment = await CommentModel.find({ feedbackId: feedbackId }).populate('user');

        // return NextResponse.json(
        //     comment.map(c => {
        //         const { userEmail, ...commentWithoutEmail } = c.toJSON();
        //         const { email, ...userWithoutEmail } = commentWithoutEmail.user;
        //         commentWithoutEmail.user = userWithoutEmail
        //         return commentWithoutEmail
        //     })
        // )
        return NextResponse.json(comment)

    }

    return NextResponse.json([])
}

export async function PUT(req) {

    const comment = await req.json();
    const { id, text, uploadImages } = comment;

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json(false);
    }

    const commentUpdated = await CommentModel.findOneAndUpdate(
        {_id: id, userEmail: session.user.email},
        {
            text,
            images: uploadImages
        }

    )

    return NextResponse.json(commentUpdated)
}