import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
        <div className="flex">
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