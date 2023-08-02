import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { api } from "~/utils/api";

import { type TSignUpSchema, SignUpSchema } from "~/server/api/routers/auth.handler";

export default function Signup() {

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
            console.log('2')
            console.log(getValues("email"))
            await signIn("credentials", {
                email: getValues("email"),
                password: getValues("password"),
                callbackUrl: '/authtest'
            });
        },
        onError: (error) => {
            console.log(error)
            setError("apiError", { message: error.message });
        },
    })

    const signUp: SubmitHandler<TSignUpSchema> = (signUpData: TSignUpSchema) => {
        console.log('here')
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
                background: 'linear-gradient(to right, #c471f5, #fa71cd)',
            }}
        >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        void handleSubmit(signUp)(e);
                    }}
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                >
                    {errors && <p className="text-red-500 text-xs italic">{errors.apiError?.message}</p>}
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