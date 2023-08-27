
import NextAuth from "next-auth/next";
import { MongoDBAdapter } from "@auth/mongodb-adapter"
import clientPromise from "@/app/libs/mongoClient";
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
    secret: process.env.AUTH_SECRET,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    adapter: MongoDBAdapter(clientPromise),
})


export { handler as GET, handler as POST }