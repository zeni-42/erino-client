"use client"

import { Button } from "../ui/button"
import { AlertCircle, Loader2, X } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import axios, { isAxiosError } from "axios"
import { toast } from "sonner"

const formDataASchema = z.object({
    firstName: z.string().min(1, "First name cannot be empty"),
    lastName: z.string().min(1, "Last name cannot be empty"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^\+?[0-9]{10}$/, "Invalid phone number"),
    company: z.string().max(255, "Character limit exceeded").optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    source: z.enum(["website", "facebook_ads", "google_ads", "referral", "events", "other"]),
    status: z.enum(["new", "contacted", "qualified", "lost", "won"]),
    score: z.string().optional(),
    leadValue: z.string().optional(),
    lastActivityAt: z.date().optional(),
    isQualified: z.boolean().default(false).optional()
})

type FormValues = z.infer<typeof formDataASchema>

interface LeadFormInterface {
    onClose: () => void
}

export default function Leadform({ onClose }: LeadFormInterface ){
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm<FormValues>({
        resolver: zodResolver(formDataASchema),
        mode: "onChange",
    })

    const handleAddLead: SubmitHandler<FormValues> = async (data: FormValues) => {
        setIsLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads`, data, { withCredentials: true })
            if (res.status == 201) {
                toast.success("Lead added")
            }
        } catch (error){
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
            reset()
            onClose()
        }
    }

    return (
        <>
        <div className="fixed top-0 left-64 w-[calc(100vw-16rem)] h-screen z-10 bg-white p-7 overflow-y-hidden" >
            <div className="flex justify-between items-center">
                <div className="flex justify-center items-start flex-col space-y-1" >
                    <h1 className="text-2xl font-medium text-zinc-700">Register new lead</h1>
                    <p className="text-sm text-zinc-600">Create new lead with all data and details </p>
                </div>
                <Button variant={"secondary"} className="cursor-pointer" onClick={() => onClose()} >
                    <X />Close
                </Button>
            </div>

            <div className="w-full mt-10" >
                <form onSubmit={handleSubmit(handleAddLead)} className="w-full px-10 " >
                    <div className="w-full flex justify-center items-center mb-10 gap-20 " >
                        <div className="space-y-4 flex flex-col w-1/2">
                            <div className="w-full flex space-x-5" >
                                <div className="w-full" >
                                    <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                        First Name
                                    </Label>
                                    <Input {...register("firstName")} autoComplete="off" placeholder="e.g. Amitab" />
                                        {errors.firstName && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                </div>
                                <div className="w-full" >
                                    <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                        Last Name
                                    </Label>
                                    <Input {...register("lastName")} autoComplete="off" placeholder="e.g. Dutta" />
                                        {errors.lastName && (
                                            <p className="mt-1 text-sm text-red-600 flex items-center">
                                                <AlertCircle className="w-4 h-4 mr-1" />
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Email
                                </Label>
                                <Input {...register("email")} autoComplete="off" placeholder="e.g. mailzeni42@gmail.com" />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.email.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Phone
                                </Label>
                                <Input {...register("phone")} type="tel" autoComplete="off" placeholder="e.g. 123 45XX XXX " />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.phone.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Company
                                </Label>
                                <Input {...register("company")} autoComplete="off" placeholder="e.g. Company pvt. ltd." />
                                    {errors.company && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.company.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    City
                                </Label>
                                <Input {...register("city")} autoComplete="off" placeholder="e.g. Tokyo" />
                                    {errors.city && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.city.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    State
                                </Label>
                                <Input {...register("state")} autoComplete="off" placeholder="e.g. California" />
                                    {errors.state && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.state.message}
                                        </p>
                                    )}
                            </div>
                        </div>
                        <div className="space-y-4 flex flex-col w-1/2" >
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Source
                                </Label>
                                <Controller control={control} name="source" render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} >
                                        <SelectTrigger className="w-full" >
                                            <SelectValue placeholder="Select source" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="website">
                                                <div className="flex items-center space-x-2">
                                                    <span>Website</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="facebook_ads">
                                                <div className="flex items-center space-x-2">
                                                    <span>Facebook Ads</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="google_ads">
                                                <div className="flex items-center space-x-2">
                                                    <span>Google Ads</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="referral">
                                                <div className="flex items-center space-x-2">
                                                    <span>Referral</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="events">
                                                <div className="flex items-center space-x-2">
                                                    <span>Events</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="other">
                                                <div className="flex items-center space-x-2">
                                                    <span>Other</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Status
                                </Label>
                                <Controller control={control} name="status" render={({ field }) => (
                                    <Select value={field.value} onValueChange={field.onChange} >
                                        <SelectTrigger className="w-full" >
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="new">
                                                <div className="flex items-center space-x-2">
                                                    <span>New</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="contacted">
                                                <div className="flex items-center space-x-2">
                                                    <span>Contacted</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="qualified">
                                                <div className="flex items-center space-x-2">
                                                    <span>Qualified</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="lost">
                                                <div className="flex items-center space-x-2">
                                                    <span>Lost</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="won">
                                                <div className="flex items-center space-x-2">
                                                    <span>Won</span>
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                )} />
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Score
                                </Label>
                                <Input {...register("score")} type="number" autoComplete="off" placeholder="e.g. 98" />
                                    {errors.score && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.score.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700 pb-1.5" >
                                    Lead Value
                                </Label>
                                <Input {...register("leadValue")} type="number" autoComplete="off" placeholder="e.g. 80" />
                                    {errors.leadValue && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                            <AlertCircle className="w-4 h-4 mr-1" />
                                            {errors.leadValue.message}
                                        </p>
                                    )}
                            </div>
                            <div>
                                <Controller control={control} name="lastActivityAt" render={({ field }) => (
                                    <div>
                                    <Label className="text-sm font-medium text-gray-700 pb-1.5">
                                        Last Activity At
                                    </Label>
                                    <Input
                                        type="date"
                                        value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                                    />
                                    {errors.lastActivityAt && (
                                        <p className="mt-1 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.lastActivityAt.message}
                                        </p>
                                    )}
                                    </div>
                                )}
                                />
                            </div>
                            <div className="w-full flex justify-between items-center border border-zinc-500/20 rounded-md h-10 px-2" >
                                <Label className="text-sm font-medium text-gray-700" >
                                    Qualified
                                </Label>
                                <Controller control={control} name="isQualified" render={({ field }) => (
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end items-center gap-5" >
                        <Button className="cursor-pointer" onClick={(e) => {e.preventDefault(); onClose()}} variant={"outline"} >Cancel</Button>
                        <Button className="cursor-pointer" type="submit" disabled={isLoading}>{ isLoading ? (<><span className="flex justify-center items-center" ><Loader2 className="animate-spin" /></span></>): (<><p>Create Lead</p></>) }</Button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}