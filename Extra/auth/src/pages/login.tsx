import { z } from "zod";
import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { ErrorCode } from "~/server/utils/ErrorCode";

interface LoginValues {
    email: string;
    password: string;
    callbackUrl: string;
}

const formSchema = z.object({
    email: z.string().min(1).email(),
    password: z.string().min(1),
}).passthrough();

export default function Login() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<LoginValues>({ resolver: zodResolver(formSchema) });

    const login: SubmitHandler<LoginValues> = async (values: LoginValues) => {
        setErrorMessage(null);

        const res = await signIn("credentials", {
            ...values,
            redirect: false,
        });

        console.log(res)

        if (!res) setErrorMessage(ErrorCode.InternalServerError)
        else if (!res.error) await router.push("/")
        else setErrorMessage(res.error || ErrorCode.InternalServerError)
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: '#f5f5f5'
            }}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit(login)(e);
                }}
                style={{
                    background: '#ffffff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    width: '300px'
                }}
            >
                <h1 style={{
                    color: '#333',
                    fontSize: '24px',
                    marginBottom: '20px'
                }} className="text-center">
                    Welcome back!
                </h1>
                {errorMessage && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{errorMessage}</p>}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', color: '#333', marginBottom: '5px', fontSize: '14px' }} htmlFor="email">
                        Email <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                        type="email"
                        {...register("email")}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    />
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', color: '#333', marginBottom: '5px', fontSize: '14px' }} htmlFor="password">
                        Password <span style={{ color: '#e74c3c' }}>*</span>
                    </label>
                    <input
                        type="password"
                        {...register("password")}
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            fontSize: '14px'
                        }}
                    />
                    <p style={{ marginTop: '5px', fontSize: '14px' }}>
                        <a href="/forgot-password" style={{ color: '#3498db', textDecoration: 'none' }}>
                            Forgot Your Password?
                        </a>
                    </p>
                </div>

                <div className="flex justify-center">
                    <input
                        type="submit"
                        value="Log In"
                        style={{
                            background: '#3498db',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                        className="w-full"
                    />
                </div>

                <p style={{ marginTop: '5px' }} className="text-center pt-2">
                    Need an account?{' '}
                    <a href="/register" style={{ color: '#3498db', textDecoration: 'none' }}>
                        Register
                    </a>
                </p>


                <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
                    <div style={{ flex: '1', height: '1px', backgroundColor: '#ccc' }} />
                    <span style={{ padding: '0 10px', color: '#666' }}>OR</span>
                    <div style={{ flex: '1', height: '1px', backgroundColor: '#ccc' }} />
                </div>

                <div className="text-blue-500 border border-blue-200 shadow">
                    <button
                        color="secondary"
                        className="w-full justify-center font-normal py-2"
                        data-testid="google"
                        onClick={(e) => {
                            e.preventDefault();
                            void signIn("google", {
                                callbackUrl: '/'
                            });
                        }}>
                        {"Continue with Google"}
                    </button>
                </div>
            </form>
        </div>
    );
}