"use client"

import { Button } from "@/components/ui/button"
import axios, { isAxiosError } from "axios"
import { BarChart3, LogOut, Settings, Shapes, Target, TrendingUp, Users } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function Sidebar(){
    const router = useRouter()
    const pathname = usePathname()
    const [ name, setName] = useState('') 

    const sidebarItems = [
        {
            links: "/dashboard",
            name: "Dashboard", 
            icon: BarChart3
        },
        {
            links: "/leads",
            name: "Leads", 
            icon: Users
        },
        {
            links: "/analytics",
            name: "Analytics", 
            icon: TrendingUp
        },
        {
            links: "/campaigns",
            name: "Campaigns", 
            icon: Target
        },
        {
            links: "/settings",
            name: "Settings", 
            icon: Settings
        },
    ]

    const handleLogout = async () => {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/user/logout`, null, { 
                withCredentials: true
            })
            console.log(res);
            if (res.status == 200) {
                router.push("/auth/signin")
                localStorage.clear()
            }
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const errMsg = error.response?.data?.message
                toast.error(errMsg || "Server error")
            } else {
                toast.error("Server error")
            }
        }
    }

    useEffect(() => {
        const storedname = localStorage.getItem("fullName")
        if (!storedname){
            toast.info("no name found")
            return
        } 
        setName(storedname)
    }, [])

    return(
        <>
        <div className={"fixed top-0 flex flex-col justify-between h-screen inset-y-0 left-0 z-50 w-64 bg-white border-r border border-orange-700/20 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0"}>
            <div>
                <div className="flex items-center justify-between h-16 px-6 border-b border-orange-700/20">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Shapes className="h-5 w-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-sidebar-foreground">LMS</h1>
                    </div>
                </div>

                <nav className="p-4 space-y-2">
                    {sidebarItems.map((item, i) => (
                        <Button key={i} variant={"ghost"} className="cursor-pointer w-full justify-start gap-3 h-11 transition-colors hover:bg-zinc-100/50" onClick={() => router.push(`${item?.links}`)} >
                            <item.icon className={ `${pathname == item?.links ? 'text-orange-500' : 'text-zinc-700'} w-5 h-5 `} />
                            <p className={ pathname == item?.links ? 'text-orange-500' : 'text-zinc-700'} >{item.name} </p>
                        </Button>
                    ))}
                </nav>
            </div>

            <footer className="w-full p-4 flex justify-between items-center" >
                <Button variant={"ghost"} className="cursor-pointer" >
                    {name}
                </Button>
                <Button variant={"outline"} className="cursor-pointer" onClick={() => handleLogout()} >
                    <LogOut />
                </Button>
            </footer>
        </div>
        </>
    )
}