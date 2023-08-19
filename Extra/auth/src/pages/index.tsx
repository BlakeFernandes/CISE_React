import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

function AuthContent({ session }: { session: Session | null }) {
    const router = useRouter();

    const test = api.authRouter.me.useQuery({ text: 'World' });

    if (session?.user) {
        return (
            <>
                <div className="mb-5 mt-3">
                    <p>Name: {session?.user.name}</p>
                    <p>Email: {session?.user.email}</p>
                </div>

                <div className="flex justify-center">
                    <input
                        type="submit"
                        value="Log Out"
                        className="w-full px-[20px] py-[10px] rounded-[4px] border-[none] cursor-[pointer] font-[16px] bg-[#3498db] text-[#fff]"
                        onClick={() => void signOut()}
                    />
                </div>
                <div className="flex justify-center mt-2">
                    <input
                        type="submit"
                        value="Forgot Password"
                        className="w-full px-[20px] py-[10px] rounded-[4px] border-[none] cursor-[pointer] font-[16px] bg-[#3498db] text-[#fff]"
                        onClick={() => void router.push('/forgot-password')}
                    />
                </div>
            </>
        )
    } else {
        return (
            <>
                <div className="text-center">
                    <p>Please log in!</p>
                </div>

                <p style={{ marginBottom: '15px', fontSize: '14px' }} className="text-center pt-2">
                    Need an account?{' '}
                    <a href="/register" style={{ color: '#3498db', textDecoration: 'none' }}>
                        Register
                    </a>
                </p>

                <div className="flex justify-center">
                    <input
                        type="submit"
                        value="Log In"
                        className="w-full px-[20px] py-[10px] rounded-[4px] border-[none] cursor-[pointer] font-[16px] bg-[#3498db] text-[#fff]"
                        onClick={() => void router.push('/login')}
                    />
                </div>
            </>
        )
    }

}

export default function Home() {
    const session = useSession();

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
            <div
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
                }} className="text-center">
                    Your Dashboard
                </h1>
                <AuthContent session={session.data} />
            </div>
        </div>
    );
}