import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

import { type TSignUpSchema, SignUpSchema } from "~/server/api/routers/auth.handler";

export default function Register() {

    const {
        register,
        handleSubmit,
        getValues,
        setError,
        formState: { errors },
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(SignUpSchema),
    });

    const mutation = api.authRouter.signUp.useMutation({
        onSuccess: async (data) => {
            await signIn("credentials", {
                email: getValues("email"),
                password: getValues("password"),
                callbackUrl: '/'
            });
        },
        onError: (error) => {
            console.log(error)
            setError("apiError", { message: error.message });
        },
    })

    const signUp: SubmitHandler<TSignUpSchema> = (signUpData: TSignUpSchema) => {
        mutation.mutate({
            email: signUpData.email,
            password: signUpData.password,
        })
    };

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
                    void handleSubmit(signUp)(e);
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
                    Create an account
                </h1>
                {errors && <p style={{ color: '#e74c3c', fontSize: '12px', marginBottom: '10px' }}>{errors.apiError?.message}</p>}
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
                    <p style={{ display: 'block', color: '#333', marginBottom: '5px', fontSize: '14px' }}>{errors.email?.message}</p>
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
                    <p style={{ display: 'block', color: '#333', marginBottom: '5px', fontSize: '14px' }}>{errors.password?.message}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <input
                        type="submit"
                        value="Register"
                        style={{
                            background: '#3498db',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    />
                </div>
                <p style={{ marginTop: '5px', fontSize: '14px' }} className="text-center">
                    <a href="/login" style={{ color: '#3498db', textDecoration: 'none' }}>
                        Already have an account?
                    </a>
                </p>
            </form>
        </div>
    );
}