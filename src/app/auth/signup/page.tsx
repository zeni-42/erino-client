"use client"

import { AlertCircle, ArrowLeft, CheckCircle, Eye, EyeOff, Loader2, Mail, Shapes } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import axios, { isAxiosError } from "axios"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const signUpSchema = z.object({
    firstName: z.string().min(1, "First name cannot be empty"),
    lastName: z.string().min(1, "Last name cannot be empty"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters")
    }
)

type signUpFormData = z.infer<typeof signUpSchema> 

export default function Signin(){
    const router = useRouter()
    const [ showPassword, setShowPassword ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(false)
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<signUpFormData>({
        resolver: zodResolver(signUpSchema),
        mode: "onChange"
    })

    const onSubmit = async (data: signUpFormData) => {
        setIsLoading(true)
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/leads/`, {
                first_name: data.firstName,
                last_name: data?.lastName,
                email: data?.email,
                password: data?.password,
            }, 
            {
                withCredentials: true,
            })
            if (res.status == 201) {
                router.push('/auth/signin')
                reset()
            }
        } catch (error: unknown ) {
            if (isAxiosError(error)) {
                const errMsg = error.response?.data?.message
                toast.error(errMsg || "Server error")
            } else {
                toast.error("Server error")
            }
        } finally {
            setIsLoading(false)
        }
    }

    return(
        <>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex flex-col">
            <header className="p-6">
                <div className="flex items-center justify-between max-w-6xl mx-auto">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                            <Shapes className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold text-gray-900">LMS</span>
                    </Link>
                    <Button variant="ghost" asChild className="text-gray-600 hover:text-orange-600">
                        <Link href="/" className="flex items-center space-x-2">
                            <ArrowLeft className="w-4 h-4" />
                            <span>Back to home</span>
                        </Link>
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8" >
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2" >
                                Create your account
                            </h1>
                        </div>
                    <div>
                    {/* Form content will be here */}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="w-full flex space-x-5" >
                            <div>
                                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                    First Name
                                </Label>
                                <Input type="text" className={`mt-1 ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"}`} {...register("firstName")} />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" >
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.firstName.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                                    Last Name
                                </Label>
                                <Input type="text" className={`mt-1 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"}`} {...register("lastName")} />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-red-600 flex items-center" >
                                        <AlertCircle className="w-4 h-4 mr-1" />
                                        {errors.lastName.message}
                                    </p>
                                )}
                            </div>

                        </div>

                        <div >
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                                Email Address
                            </Label>
                            <Input id="email" type="email" className={`mt-1 ${errors.email ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"}`} {...register("email")} />
                                {errors.email && (
                                <p className="mt-1 text-sm text-red-600 flex items-center" >
                                    <AlertCircle className="w-4 h-4 mr-1" />
                                    {errors.email.message}
                                </p>
                                )}
                        </div>

                        <div >
                            <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                Password
                            </Label>
                            <div className="relative mt-1">
                                <Input id="password" type={showPassword ? "text" : "password"} className={`pr-10 ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-orange-500 focus:border-orange-500"}`} {...register("password")} />
                                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)} >
                                    {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
                                </button>
                            </div>

                            {errors.password && (
                            <p className="mt-1 text-sm text-red-600 flex items-center" >
                                <AlertCircle className="w-4 h-4 mr-1" />
                                {errors.password.message}
                            </p>
                            )}
                        </div>

                        <div>
                            <Button type="submit" disabled={!isValid || isLoading} className="cursor-pointer w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed" >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating Account...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Create Account
                                </>
                            )}
                            </Button>
                        </div>
                        </form>
                    </div>

                        <div className="text-center mt-6 pt-6 border-t border-gray-100" >
                            <p className="text-sm text-gray-600">
                                Already have an account {" "}
                                <Link href={"/auth/signin"} className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
    </div>
        </>
    )
}