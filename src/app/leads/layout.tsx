import Sidebar from "@/components/layout/Sidebar";
import React from "react";

export default function LeadLayout({ children }: { children: React.ReactNode }){
    return(
        <>
        <div className="flex" >
            <aside className="fixed top-0" >
                <Sidebar />
            </aside>
            <main className="ml-64 w-[calc(100vw-16rem)]" >
                {children}
            </main>
        </div>
        </>
    )
}