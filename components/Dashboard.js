
"use client";
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { fetchuser, updateProfile } from '@/actions/useractions'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';

const Dashboard = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [form, setform] = useState({})

    useEffect(() => {
        if (status === "loading") return;

        if (status === "unauthenticated") {
            router.push('/login')
        }
        else if (status === "authenticated" && !session?.user?.email) {
            getData()
        }

    }, [status, session])

    const getData = async () => {
        if (!session?.user?.email) return;
        let u = await fetchuser(session?.user?.email)
        setform(u)
    }

    const handleChange = (e) => {
        setform({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateProfile(e, session?.user?.email)
        toast('Profile Updated', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    }

    if (status === "loading") {
        return (
            <div className="text-center text-white mt-10">
                Loading Dashboard...
            </div>
        )
    }


    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <div className='container mx-auto py-5 px-6 '>
                <h1 className='text-center my-5 text-3xl font-bold'>
                    Welcome to your Dashboard
                </h1>

                <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>

                    <div className='my-2'>
                        <label className="block mb-2 text-sm font-medium text-white">Name</label>
                        <input value={form.name || ""} onChange={handleChange} type="text" name='name'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-2">
                        <label className="block mb-2 text-sm font-medium text-white">Email</label>
                        <input value={form.email || ""} onChange={handleChange} type="email" name='email'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className='my-2'>
                        <label className="block mb-2 text-sm font-medium text-white">Username</label>
                        <input value={form.username || ""} onChange={handleChange} type="text" name='username'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-2">
                        <label className="block mb-2 text-sm font-medium text-white">Profile Picture</label>
                        <input value={form.profilepic || ""} onChange={handleChange} type="text" name='profilepic'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-2">
                        <label className="block mb-2 text-sm font-medium text-white">Cover Picture</label>
                        <input value={form.coverpic || ""} onChange={handleChange} type="text" name='coverpic'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-2">
                        <label className="block mb-2 text-sm font-medium text-white">Razorpay Id</label>
                        <input value={form.razorpayid || ""} onChange={handleChange} type="text" name='razorpayid'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-2">
                        <label className="block mb-2 text-sm font-medium text-white">Razorpay Secret</label>
                        <input value={form.razorpaysecret || ""} onChange={handleChange} type="text" name='razorpaysecret'
                            className="block w-full p-2 rounded-lg bg-gray-700 text-white" />
                    </div>

                    <div className="my-6">
                        <button type="submit"
                            className="block w-full p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default Dashboard;