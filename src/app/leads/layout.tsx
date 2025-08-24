import Sidebar from "@/components/layout/Sidebar";
import React from "react";

export default function LeadLayout({ children }: { children: React.ReactNode }){
    return(
        <>
        <div className="flex" >
            <aside>
                <Sidebar />
            </aside>
            <main className="p-7" >
                {children}
            </main>
        </div>
        </>
    )
}