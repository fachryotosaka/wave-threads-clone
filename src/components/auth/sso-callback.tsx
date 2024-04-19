"use client";
import { useEffect } from 'react';
import { signIn, getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Icons } from '@/components/icons';
import { SSOCallbackPageProps } from '@/app/(authPages)/sso-callback/page';

export default function SSOCallback({ searchParams }: SSOCallbackPageProps) {
    const router = useRouter();

    useEffect(() => {
        const handleSignIn = async () => {
            const csrfToken = await getCsrfToken();

            if (!searchParams.code) {
                // If there's no code in searchParams, redirect to home page or any other page
                router.push('/');
                return;
            }

            const result = await signIn('google', {
                code: searchParams.code,
                csrfToken,
                redirect: false, // We handle redirection ourselves
            });

            if (result?.error) {
                console.error('Error during sign-in:', result.error);
                // Handle error
            } else {
                // Redirect user after successful sign-in
                router.push('/');
            }
        };

        handleSignIn();
    }, [searchParams, router]);

    return (
        <div
            role="status"
            aria-label="Loading"
            aria-describedby="loading-description"
            className="flex items-center justify-center"
        >
            <Icons.spinner className="h-16 w-16 animate-spin" aria-hidden="true" />
        </div>
    );
}
