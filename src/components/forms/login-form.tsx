"use client";
import React, { startTransition } from 'react';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { signIn } from 'next-auth/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import { cn } from '@/lib/utils';
import { authSchema } from '@/validators/auth';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
} from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation'; // Correct import

export default function LoginForm() {
    const router = useRouter();
    type Inputs = z.infer<typeof authSchema>;

    const [isPending, setIsPending] = React.useState(false); // Track pending state

    // react-hook-form
    const form = useForm<Inputs>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    async function onSubmit(data: Inputs) {

            try {
                const result = await signIn('credentials', {
                    redirect: false,
                    email: data.email,
                    password: data.password,
                    callbackUrl: "/",
                });
    
                if (!result?.ok) {
                    toast.error('Sorry, something went wrong. Please try again, or refresh the page.');
                } else {
                    toast.success("You're successfully signing in...");
                    router.push('/');
                }
            } catch (err) {
                console.error(err);
                toast.error('An unexpected error occurred. Please try again later.');
            }
    }    

    return (
        <div>
            <span className="text-white font-bold select-none">Log in with your Instagram account</span>

            <Form {...form}>
                <form
                    className="w-full flex flex-col py-4 gap-1.5 text-start"
                    onSubmit={form.handleSubmit(onSubmit)} 
                >

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field, formState }) => {
                            const error = formState.errors.email;
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            autoFocus
                                            className={cn('h-14 rounded-xl bg-[#1e1e1e] text-[15px] placeholder:text-[#777777] font-medium tracking-normal outline-none ring-0  focus-visible:ring-offset-0 min-h-min border-none focus-visible:ring-1 focus-visible:ring-[#393939] dark:focus-visible:ring-[#393939] px-4 text-white', {
                                                'focus-visible:ring-red-700 placeholder:text-red-700 dark:focus-visible:ring-red-700': error,
                                            })}
                                            placeholder={error ? error.message : 'Username, phone or email'}
                                            type="text"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field, formState }) => {
                            const error = formState.errors.password;
                            return (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            className={cn('h-14 rounded-xl bg-[#1e1e1e]  text-[15px] placeholder:text-[#777777] font-medium  tracking-normal outline-none ring-0  focus-visible:ring-offset-0 min-h-min border-none focus-visible:ring-1 focus-visible:ring-[#393939] px-4 dark:focus-visible:ring-[#393939] text-white', {
                                                'focus-visible:ring-red-700 placeholder:text-red-700 dark:focus-visible:ring-red-700': error,
                                            })}
                                            placeholder={error ? error.message : 'Password'}
                                            type="password"
                                            {...field}
                                        />
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                    <Button
                        type="submit"
                        disabled={isPending}
                        className="h-14 rounded-xl my-1 font text-base font-semibold bg-white hover:bg-white text-black"
                    >
                        {isPending ? (
                            <Icons.loading
                                className="h-10 w-10"
                                aria-hidden="true"
                            />
                        ) : (
                            'Log in'
                        )}
                        <span className="sr-only">Sign in</span>
                    </Button>
                </form>
            </Form>
        </div>
    );
}
