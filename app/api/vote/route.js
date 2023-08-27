import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import VoteModel from "@/app/models/Vote";
import { NextResponse } from "next/server";

export async function POST(req) {

    const mongoUrl = process.env.MONGO_URL
    await mongoose.connect(mongoUrl)

    const vote = await req.json();
    const { feedbackId } = vote;

    const session = await getServerSession(authOptions)
    const { email } = session.user

    const existingVote = await VoteModel.findOne({feedbackId, userEmail: email})

    if(existingVote){
        await VoteModel.findByIdAndDelete({ _id:existingVote._id })
        return NextResponse.json(existingVote)
    }
    else {
        const voteOutput = await VoteModel.create({ userEmail: email, feedbackId })
        return NextResponse.json({ message: "Vote added", voteOutput }, { status: 201 })
    }
    
}

export async function GET(req) {
    const url = new URL(req.url)

    if(url.searchParams.get('feedbackIds')) {
        const feedbackIds = url.searchParams.get('feedbackIds').split(',')

        const votes = await VoteModel.find({ feedbackId: feedbackIds })
        return NextResponse.json(votes)
    }

    return NextResponse.json([])
}