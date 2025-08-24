"use client"

import { ArrowRight, Shapes } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Navbar(){
    const router = useRouter() 

    return (
        <>
        <div className="w-full h-16 flex justify-between items-center bg-white border-b border border-orange-700/15 px-96">
            <div className="flex justify-start items-center space-x-3" >
                <span className="size-10 flex justify-center items-center bg-gradient-to-bl from-amber-600 via-orange-500 to-orange-600 rounded-md text-white" >
                    <Shapes />
                </span>
                <h1 className="text-xl font-bold" >
                    LMS
                </h1>
            </div>

            <div className="flex justify-end items-center space-x-3" >
                <Button className="cursor-pointer" variant={"secondary"} onClick={() => router.push('/auth/signin')} > Sign in </Button>
                <Button className="cursor-pointer" onClick={() => router.push("/auth/signup")} >
                    Get Started
                    <span>
                        <ArrowRight />
                    </span>
                </Button>
            </div>
        </div>
        </>
    )
}