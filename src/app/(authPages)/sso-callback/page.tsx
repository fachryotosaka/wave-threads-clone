import { GetServerSideProps } from 'next'
import SSOCallback from '@/components/auth/sso-callback'
import { getSession } from 'next-auth/react'

// Definisikan OAuthCallbackParams secara manual
interface OAuthCallbackParams {
    code: string;
    provider: string;
    redirect_uri: string;
}

export interface SSOCallbackPageProps {
    searchParams: OAuthCallbackParams;
}

export default function SSOCallbackPage({
    searchParams,
}: SSOCallbackPageProps) {
    return (
        <div className="h-[90vh] flex justify-center items-center">
            <SSOCallback searchParams={searchParams} />
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context)
    
    if (!session) {
        return {
            redirect: {
                destination: '/login', // or any other page you want to redirect
                permanent: false,
            },
        }
    }
    
    const { query } = context
    const searchParams: OAuthCallbackParams = {
        code: query.code as string,
        provider: query.provider as string,
        redirect_uri: query.redirect_uri as string,
    }
    
    return {
        props: {
            searchParams,
        },
    }
}
