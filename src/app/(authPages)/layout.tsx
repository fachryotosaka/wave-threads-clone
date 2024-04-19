"use client";
import { useSession } from 'next-auth/react'
import Banner from "@/components/threads-banner"
import SiteFooter from "@/components/layouts/site-footer"
import { useRouter } from 'next/navigation'

interface AuthLayoutProps {
    children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    const { data: session, status } = useSession()
    const router = useRouter()

    // Redirect if the user is authenticated
    if (status === 'authenticated') {
        router.push('/')
        return null // Render nothing while redirecting
    }

    // Render loading state while session is being fetched
    if (status === 'loading') {
        return (
            <>
                <div className="bg-[#101010] h-screen">
                    <Banner />
                    <div className="absolute z-50 -translate-x-2/4 -translate-y-2/4 sm:-translate-y-[40%] left-2/4 top-2/4 w-full px-4 sm:px-0">
                        Loading...
                    </div>
                    <SiteFooter />
                </div>
            </>
        )
    }

    // Render the children if not authenticated and session is not loading
    return (
        <>
            <div className="bg-[#101010] h-screen">
                <Banner />
                <div className="absolute z-50 -translate-x-2/4 -translate-y-2/4 sm:-translate-y-[40%] left-2/4 top-2/4 w-full px-4 sm:px-0">
                    {children}
                </div>
                <SiteFooter />
            </div>
        </>
    )
}
