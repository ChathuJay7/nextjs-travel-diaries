"use client"

import { SessionProvider } from "next-auth/react"
import FeedbackBoard from "./components/FeedbackBoard"

export default function Home() {

  return (
    <SessionProvider>
      <FeedbackBoard />
    </SessionProvider>
      
    
  )
}
