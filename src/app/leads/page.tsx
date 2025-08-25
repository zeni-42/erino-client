"use client"

import FilterForm from "@/components/layout/FilterForm";
import Leadform from "@/components/layout/LeadForm";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios, { isAxiosError } from "axios";
import { Delete, Filter, MenuIcon, Pencil, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fa } from "zod/v4/locales";

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
    const [total, setTotal] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [page, setPage] = useState(0)
    const [limit, setLimit] = useState(20)
    const [isLoading, setIsLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [showFilter, setShowFilter] = useState(false)
    const [showFooter, setShowFooter ] = useState(true)
    const [showEditForm, setShowEditForm] = useState(false)

    const getLeads = async (page: number) => {
        setIsLoading(true)
        try {
            if (!page) {
                page = 1
            }
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads?page=${page}&limit=${limit}`, { withCredentials: true })
            if (res.status == 200) {
                setLeads(res.data?.data?.data)
                setTotalPages(res?.data?.data?.totalPages || 1)
                setPage(res.data?.data?.page)
                setTotal(res.data?.data?.total)
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
        } finally {
            setIsLoading(false)
        }
    }

    const handleDeleteRecord = async (leadId: string) => {
        try {
            const res = await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads/${leadId}`, { withCredentials: true })
            if (res.status == 200) {
                console.log(res);
                toast.success("Record removed")
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
        } finally {
            getLeads(1)
        }
    }

    const handleSearchQuery = async (keyword: string) => {
        setShowFooter(false)
        setIsLoading(true)
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads/query?q=${keyword}`, { withCredentials: true })
            setLeads(res?.data?.data)
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
        } finally {
            setIsLoading(false)
        }
    }

    const handledFilteredQuery = async (filters: Record<string, string> = {}) => {
        setShowFooter(false)
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads/allquery`, {
                params: filters,
                withCredentials: true
            })
            setLeads(res.data?.data)
        } catch (error: unknown) {
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
        getLeads(1)
        setShowFooter(true)
    }, [limit])

    return(

        <>
        {showForm && <Leadform onClose={() => {setShowForm(false); getLeads(1)}} />}
        {showFilter && <FilterForm onClose={() => setShowFilter(false)} onApply={handledFilteredQuery} />}
        {showEditForm &&  1 }
            <div className="w-full p-7" >
                <div className="w-full h-16 flex justify-between items-center" >
                    <div>
                        <h1 className="text-2xl font-semibold" >Leads Management</h1>
                        <p className="text-sm text-zinc-600" >Manage and track all your leads in one place.</p>
                    </div>
                    <div className="flex justify-end items-center space-x-3" >
                        <Button variant={"secondary"} className="w-32 cursor-pointer" onClick={() => setShowFilter(true)} >
                            <span> <Filter className="w-5 h-5" /> </span>
                            <p> Filter </p>
                        </Button>
                        <Button className="cursor-pointer" onClick={() => setShowForm(true)} >
                            <span> <Plus className="w-5 h-5" /> </span>
                            <p> Add New Lead </p>
                        </Button>
                    </div>
                </div>

                <div className="w-full h-auto p-5 mt-5 bg-white rounded-xl border border-orange-600/20 flex space-x-5">
                    <Input placeholder="Search leads by name, company, email, or city (press ENTER)" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearchQuery(search)} />

                    <Select value={String(limit)} onValueChange={(val) => setLimit(Number(val))}>
                    <SelectTrigger className="w-80">
                        <SelectValue placeholder="Limit" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                    </Select>

                    <Button className="cursor-pointer" variant={"secondary"} onClick={() => setSearch("")} >
                        <span>
                            <Delete />
                        </span>
                        Clean
                    </Button>
                    <Button className="cursor-pointer" variant={"secondary"} onClick={() => {getLeads(1); setShowFooter(true)}} >
                        <span>
                            <RefreshCcw />
                        </span>
                    </Button>
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
                                    <th className="p-3 flex justify-center items-center"><MenuIcon /></th>
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
                                            <td className="space-x-1.5" onClick={() => console.log("huhh")} >
                                                <Button variant={"outline"}>
                                                    <Pencil />
                                                </Button>

                                                <Button variant={"outline"} onClick={() => handleDeleteRecord(lead?._id)} >
                                                    <Trash2 />
                                                </Button>
                                            </td>
                                        </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {
                                showFooter && (
                                    <>
                                        <div className="flex justify-center items-center space-x-2 mt-5">
                                            <Button className="cursor-pointer" variant="outline" disabled={page === 1} onClick={() => getLeads(page - 1)} >
                                                Previous
                                            </Button>
                                            <div>
                                                {page} / {totalPages} - {`${total} records`}
                                            </div>
                                            <Button className="cursor-pointer" variant="outline" disabled={page === totalPages} onClick={() => getLeads(page + 1)} >
                                                Next
                                            </Button>
                                        </div>
                                    </>
                                )
                            }
                        </>) 
                    }
                </div>
            </div>
        </>
    )
}