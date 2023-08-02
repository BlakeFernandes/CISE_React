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

        if (!res) setErrorMessage(ErrorCode.InternalServerError)
        else if (!res.error) await router.push("/authtest")
    }

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                background: 'linear-gradient(to right, #c471f5, #fa71cd)',
            }}
        >
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    void handleSubmit(login)(e);
                }}
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email:
                    </label>
                    <input
                        type="email"
                        defaultValue={"asdsad@gmail.com"}
                        {...register("email")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password:
                    </label>
                    <input
                        type="password"
                        defaultValue={"129081320981238901"}
                        {...register("password")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="flex items-center justify-between">
                    <input
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    />
                </div>
            </form>
        </div>
    );
}