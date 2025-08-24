"use client"

import Leadform from "@/components/layout/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios, { isAxiosError } from "axios";
import { Download, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Lead = {
    _id: string,
    first_name: string
    last_name: string
    email: string
    phone: string
    company?: string
    city?: string
    state?: string
    source: "website" | "facebook_ads" | "google_ads" | "referral" | "events" | "other"
    status: "new" | "contacted" | "qualified" | "lost" | "won"
    score?: string
    lead_value?: string
    is_qualified?: boolean
}

export default function Lead(){
    const [showForm, setShowForm] = useState(false)
    const [leads, setLeads] = useState<Lead[]>([])
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)

    const getLeads = async (page: number = 1) => {
        try {
            if (!page) {
                page = 1
            }
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads?page=${page}`, { withCredentials: true })
            if (res.status == 200) {
                console.log(res?.data?.data);
                setLeads(res.data?.data?.data)
                setTotalPages(res?.data?.data?.totalPages || 1)
                setCurrentPage(res.data?.page || page)

            }
        } catch (error) {
            if (isAxiosError(error)) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(error.request.response, "text/html");
                const preElement = doc.querySelector("pre");
                let preText = "No error details found";
                
                if (preElement) {
                    preText = preElement.innerHTML.split("<br>")[0];
                }

                toast.error(preText || "Server error")
            } else {
                toast.error("Server error")
            }
        }
    }

    useEffect(() => {
        getLeads()
    }, [])

    return(

        <>
        {showForm && <Leadform onClose={() => {setShowForm(false); getLeads()}} />}
            <div className="w-full p-7" >
                <div className="w-full h-16 flex justify-between items-center" >
                    <div>
                        <h1 className="text-2xl font-semibold" >Leads Management</h1>
                        <p className="text-sm text-zinc-600" >Manage and track all your leads in one place.</p>
                    </div>
                    <div className="flex justify-end items-center space-x-3" >
                        <Button variant={"secondary"} className="w-32 cursor-pointer" >
                            <span> <Download className="w-5 h-5" /> </span>
                            <p> Export </p>
                        </Button>
                        <Button className="cursor-pointer" onClick={() => setShowForm(true)} >
                            <span> <Plus className="w-5 h-5" /> </span>
                            <p> Add New Lead </p>
                        </Button>
                    </div>
                </div>

                <div className="w-full h-auto p-5 mt-5 bg-white rounded-xl border border-orange-600/20 " >
                    <div className="flex space-x-5" >
                        <Input placeholder='Search leads by name, company or emails' className="w-1/2" />
                        <Select>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <Select>
                            <SelectTrigger className="w-40">
                                <SelectValue placeholder="Theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="mt-7" >
                    {
                        leads && leads.length == 0 ? (<>
                        <div className="flex justify-center items-center" >
                            <p className="text-xl font-medium text-orange-500 " >No Leads found, try adding one :)</p>
                        </div>
                        </>) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="bg-zinc-100 text-left text-zinc-600">
                                    <th className="p-3">#</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Phone</th>
                                    <th className="p-3">Company</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Source</th>
                                    <th className="p-3">Status</th>
                                    <th className="p-3">Score</th>
                                    <th className="p-3">Value</th>
                                    <th className="p-3">Qualified</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map((lead, i) => (
                                        <tr key={lead._id} className="border-b hover:bg-zinc-50">
                                            <td className="p-3">
                                                {i + 1}
                                            </td>
                                            <td className="p-3 font-medium text-zinc-800">
                                            {lead.first_name} {lead.last_name}
                                            </td>
                                            <td className="p-3">{lead.email}</td>
                                            <td className="p-3">{lead.phone}</td>
                                            <td className="p-3">{lead.company || "-"}</td>
                                            <td className="p-3">{[lead.city, lead.state].filter(Boolean).join(", ") || "-"}</td>
                                            <td className="p-3">
                                            <Badge variant="outline">{lead.source}</Badge>
                                            </td>
                                            <td className="p-3">
                                            <Badge
                                                className={
                                                lead.status === "won"
                                                    ? "bg-green-100 text-green-500"
                                                    : lead.status === "lost"
                                                    ? "bg-red-100 text-red-500"
                                                    : "bg-zinc-100 text-zinc-700"
                                                }
                                            >
                                                {lead.status}
                                            </Badge>
                                            </td>
                                            <td className="p-3">{lead.score || "-"}</td>
                                            <td className="p-3">{lead.lead_value || "-"}</td>
                                            <td className="p-3">
                                            {lead.is_qualified ? (
                                                <Badge className="bg-green-600 text-white">Yes</Badge>
                                            ) : (
                                                <Badge className="bg-zinc-300 text-zinc-700">No</Badge>
                                            )}
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                </div>
                            <div className="flex justify-center items-center space-x-2 mt-5">
                                <Button  variant="outline"  disabled={currentPage === 1}  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} >
                                    Previous
                                </Button>
                                {[...Array(totalPages)].map((_, index) => (
                                    <div key={index} onClick={() => setCurrentPage(index + 1)} className="size-7 px-1 border border-zinc-500/40 flex justify-center items-center rounded"  >
                                        {index + 1}
                                    </div>
                                ))}
                                <Button  variant="outline"  disabled={currentPage === totalPages}  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} >
                                    Next
                                </Button>
                            </div>
                        </>) 
                    }
                </div>
            </div>
        </>
    )
}