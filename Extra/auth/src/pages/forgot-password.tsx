import { GetServerSidePropsContext, NextPage } from "next";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";

import { ForgotPasswordSchema, type TForgotPasswordSchema } from "~/server/api/routers/auth/forgot-password.schema";
import { api } from "~/utils/api";

const ForgotPassword = () => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<TForgotPasswordSchema>({ resolver: zodResolver(ForgotPasswordSchema) });

    const mutation = api.authRouter.forgotPassword.useMutation({
        onSuccess: async (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const forgotPassword: SubmitHandler<TForgotPasswordSchema> = (values: TForgotPasswordSchema) => {
        setErrorMessage(null);

        mutation.mutate({ email: values.email })
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
                    void handleSubmit(forgotPassword)(e);
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
                    Reset your password
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

                <div className="flex justify-center">
                    <input
                        type="submit"
                        value="Send password reset email"
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
            </form>
        </div>
    );
};

export default ForgotPassword;