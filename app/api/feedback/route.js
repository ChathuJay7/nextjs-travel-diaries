
import FeedbackModel from "@/app/models/Feedback";
import mongoose from "mongoose"
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";
import User from "@/app/models/User";
import CommentModel from "@/app/models/Comment";
import VoteModel from "@/app/models/Vote";

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
        const feedback = await FeedbackModel.findById(url.searchParams.get('id')).populate('user');
        return NextResponse.json(feedback);
        // return NextResponse.json(
        //     await FeedbackModel.findById(url.searchParams.get('id'))
        // );
    } else {
        let sortDef;
        const sortParam = url.searchParams.get('sort');
        const searchParam = url.searchParams.get('search');

        if(sortParam === "latest") {
            sortDef = {createdAt:-1}
        }
        if(sortParam === "oldest") {
            sortDef = {createdAt:1}
        }
        if(sortParam === "votes") {
            sortDef = {votesCountCached: -1}
        }

        let filter = null
        if(searchParam) {
            const comments = await CommentModel.find({text:{$regex:'.*'+searchParam+'.*'}},"feedbackId",{limit:10})
            filter = {
                $or:[
                    {title:{$regex:'.*'+searchParam+'.*'}},
                    {description:{$regex:'.*'+searchParam+'.*'}},
                    {_id:comments.map(c => c.feedbackId)}
                ]
            }
        }

        const feedbacks = await FeedbackModel.find(filter, null, {sort:sortDef}).populate('user');
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


export async function DELETE(req) {

    const feedback = await req.json();
    const { id } = feedback;
    console.log(id)

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const session = await getServerSession(authOptions)

    if(!session) {
        return NextResponse.json(false);
    }

    const feedbackDelete = await FeedbackModel.deleteOne(
        {_id: id, userEmail: session.user.email}
        
    )

    const commentsDelete = await CommentModel.deleteMany(
        {
            feedbackId: id
        }
        
    )

    const votesDelete = await VoteModel.deleteMany(
        {
            feedbackId: id
        }
        
    )

    console.log("Feedback deleted")
    return NextResponse.json({ message: 'Feedback deleted' });
}