import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { getSession, useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';

export default function Test() {
    const session = useSession();

    return (
        <>
            <p>ID: {session.data?.user.id}</p>
            <p>EMAIL: {session.data?.user.email}</p>
        </>
    );
}

// export async function getServerSideProps({ req, res }: GetServerSidePropsContext) {
//     const session = await getSession({ req });

//     console.log(session?.user)
  
//     if (!session?.user?.id) {
//       return { redirect: { permanent: false, destination: "/signup" } };
//     }

//     return {};
// }
  