import { X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../ui/select"
import { useState } from "react"
import { Label } from "../ui/label"

interface FilterInterface {
    onClose: () => void
    onApply: (params: Record<string, string>) => void
}

export default function FilterForm({ onClose, onApply }: FilterInterface) {
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [source, setSource] = useState("")
    const [scoreMin, setScoreMin] = useState("")
    const [scoreMax, setScoreMax] = useState("")
    const [valueMin, setValueMin] = useState("")
    const [valueMax, setValueMax] = useState("")
    const [createdFrom, setCreatedFrom] = useState("")
    const [createdTo, setCreatedTo] = useState("")
    const [lastActivityFrom, setLastActivityFrom] = useState("")
    const [lastActivityTo, setLastActivityTo] = useState("")
    const [isQualified, setIsQualified] = useState("")
    const [limit, setLimit] = useState("1000")
    
    const applyFilters = () => {
        const params: Record<string, string> = {}

        if (search) params["search"] = search
        if (status) params["status_equals"] = status
        if (source) params["source_equals"] = source

        if (scoreMin && scoreMax) params["score_between"] = `${scoreMin},${scoreMax}`
        else {
            if (scoreMin) params["score_gt"] = scoreMin
            if (scoreMax) params["score_lt"] = scoreMax
        }

        if (valueMin && valueMax) params["lead_value_between"] = `${valueMin},${valueMax}`
        else {
            if (valueMin) params["lead_value_gt"] = valueMin
            if (valueMax) params["lead_value_lt"] = valueMax
        }

        if (createdFrom && createdTo) params["created_at_between"] = `${createdFrom},${createdTo}`
        else {
            if (createdFrom) params["created_at_after"] = createdFrom
            if (createdTo) params["created_at_before"] = createdTo
        }

        if (lastActivityFrom && lastActivityTo)
            params["last_activity_at_between"] = `${lastActivityFrom},${lastActivityTo}`
        else {
            if (lastActivityFrom) params["last_activity_at_after"] = lastActivityFrom
            if (lastActivityTo) params["last_activity_at_before"] = lastActivityTo
        }

        if (isQualified) params["is_qualified_equals"] = isQualified
        params["limit"] = limit

        onApply(params)
        onClose()
    }

    const clearFilters = () => {
        setSearch("")
        setStatus("")
        setSource("")
        setScoreMin("")
        setScoreMax("")
        setValueMin("")
        setValueMax("")
        setCreatedFrom("")
        setCreatedTo("")
        setLastActivityFrom("")
        setLastActivityTo("")
        setIsQualified("")
        setLimit("20")
        onApply({})
        onClose()
    }
return (
    <div className="fixed top-0 left-64 w-[calc(100vw-16rem)] h-screen z-10 bg-white p-7 overflow-y-auto">
        <div className="flex justify-between items-center">
            <div className="flex flex-col space-y-1">
                <h1 className="text-2xl font-medium text-zinc-700">Filters</h1>
                <p className="text-sm text-zinc-600">Apply filters as per your need</p>
            </div>
            <Button variant="secondary" onClick={onClose}>
                <X className="mr-2 h-4 w-4" /> Close
            </Button>
        </div>
        <div className="mt-6 space-y-5">
            <div>
                <Label className="block text-sm font-medium mb-1">Search</Label>
                <Input placeholder="Name, Company, Email, City" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="w-full flex justify-center items-center space-x-3" >
                <div className="w-full" >
                    <Label className="block text-sm font-medium mb-1">Status</Label>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Select status"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="qualified">Qualified</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                            <SelectItem value="won">Won</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full" >
                    <Label className="block text-sm font-medium mb-1">Source</Label>
                    <Select value={source} onValueChange={setSource}>
                        <SelectTrigger className="w-full" >
                            <SelectValue placeholder="Select source"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="website">Website</SelectItem>
                            <SelectItem value="facebook_ads">Facebook Ads</SelectItem>
                            <SelectItem value="google_ads">Google Ads</SelectItem>
                            <SelectItem value="referral">Referral</SelectItem>
                            <SelectItem value="events">Events</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium mb-1">Score Range</Label>
                <div className="flex space-x-3">
                    <Input type="number" placeholder="Min" value={scoreMin} onChange={(e) => setScoreMin(e.target.value)} />
                    <Input type="number" placeholder="Max" value={scoreMax} onChange={(e) => setScoreMax(e.target.value)} />
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium mb-1">Lead Value Range</Label>
                <div className="flex space-x-3">
                    <Input type="number" placeholder="Min" value={valueMin} onChange={(e) => setValueMin(e.target.value)} />
                    <Input type="number" placeholder="Max" value={valueMax} onChange={(e) => setValueMax(e.target.value)} />
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium mb-1">Created At</Label>
                <div className="flex space-x-3">
                    <Input type="date" value={createdFrom} onChange={(e) => setCreatedFrom(e.target.value)} />
                    <Input type="date" value={createdTo} onChange={(e) => setCreatedTo(e.target.value)} />
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium mb-1">Last Activity</Label>
                <div className="flex space-x-3">
                    <Input type="date" value={lastActivityFrom} onChange={(e) => setLastActivityFrom(e.target.value)} />
                    <Input type="date" value={lastActivityTo} onChange={(e) => setLastActivityTo(e.target.value)} />
                </div>
            </div>
            <div>
                <Label className="block text-sm font-medium mb-1">Qualified</Label>
                <Select value={isQualified} onValueChange={setIsQualified}>
                    <SelectTrigger><SelectValue placeholder="Yes / No" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex justify-end items-center space-x-3 pt-4">
                <Button variant="outline" onClick={clearFilters}>Clear</Button>
                <Button onClick={applyFilters}>Search with filters</Button>
            </div>
        </div>
    </div>
)}
