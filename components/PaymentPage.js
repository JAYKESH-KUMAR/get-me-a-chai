"use client"
import React, { useEffect, useState } from 'react'
import Script from 'next/script'
import { fetchuser, fetchpayments, initiate } from '@/actions/useractions'
import { useSearchParams } from 'next/navigation'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bounce } from 'react-toastify';
import { useRouter } from 'next/navigation'

const PaymentPage = ({ username }) => {

    const [paymentform, setPaymentform] = useState({name: "", message: "", amount: ""})
    const [currentUser, setcurrentUser] = useState({})
    const [payments, setPayments] = useState([])
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        if(searchParams.get("paymentdone") == "true"){
            toast('Thanks for your donation!', {
                position: "top-right",
                autoClose: 5000,
                theme: "light",
                transition: Bounce,
            });
        }
        // ❌ redirect हटाया (यही bug था)
    }, [searchParams])

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value })
    }

    const getData = async () => {
        let u = await fetchuser(username)
        setcurrentUser(u)
        let dbpayments = await fetchpayments(username)
        setPayments(dbpayments) 
    }

    const pay = async (amount) => {
        let a = await initiate(amount, username, paymentform)
        let orderId = a.id

        var options = {
            "key": currentUser.razorpayid,
            "amount": amount,
            "currency": "INR",
            "name": "Get Me A Chai",
            "description": "Test Transaction",
            "image": "https://example.com/your_logo",
            "order_id": orderId,
            "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
            "prefill": {
                "name": "Jaykesh kumar",
                "email": "Jaykesh.kumar@example.com",
                "contact": "9000090000"
            },
            "notes": {
                "address": "Razorpay Corporate Office"
            },
            "theme": {
                "color": "#3399cc"
            }
        }

        var rzp1 = new Razorpay(options);
        rzp1.open();
    }

    return (
        <>
            <ToastContainer theme="light" />
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>

            <div className='cover w-full bg-red-50 relative'>
                <img className='object-cover w-full h-48 md:h-[350px]' src={currentUser.coverpic} alt="" />
                <div className='absolute -bottom-20 right-[33%] md:right-[46%] border-white overflow-hidden border-2 rounded-full size-36'>
                    <img className='rounded-full object-cover size-36' src={currentUser.profilepic} alt="" />
                </div>
            </div>

            <div className="info flex justify-center items-center my-24 mb-32 flex-col gap-2 text-white">

                <div className='font-bold text-lg'>@{username}</div>

                <div className='text-slate-400'>
                    Lets help {username} get a chai!
                </div>

                <div className='text-slate-400'>
                  {payments.length} Payments . ₹{payments.reduce((a, b) => a + b.amount, 0)} raised
                </div>

                <div className="payment flex gap-3 w-[80%] mt-11 flex-col md:flex-row">

                    <div className="supporters w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">
                        <h2 className='text-2xl font-bold my-5'> Top 10 Supporters</h2>
                        <ul className='mx-5 text-lg'>
                            {payments.length == 0 && <li>No payments yet</li>}
                            {payments.map((p, i) => {
                                return <li key={i} className='my-4 flex gap-2 items-center'>
                                    <img width={33} src="avatar.gif" alt="" />
                                    <span>
                                        {p.name} donated <span className='font-bold'>₹{p.amount}</span> with message "{p.message}"
                                    </span>
                                </li>
                            })}
                        </ul>
                    </div>

                    <div className="makePayment w-full md:w-1/2 bg-slate-900 rounded-lg text-white px-2 md:p-10">

                        <h2 className='text-2xl font-bold my-5'>Make a Payment</h2>

                        <div className='flex gap-2 flex-col'>

                            <input onChange={handleChange} value={paymentform.name} name='name'
                                className='w-full p-3 rounded-lg bg-slate-800 text-white'
                                placeholder='Enter Name' />

                            <input onChange={handleChange} value={paymentform.message} name='message'
                                className='w-full p-3 rounded-lg bg-slate-800 text-white'
                                placeholder='Enter Message' />

                            <input onChange={handleChange} value={paymentform.amount} name="amount"
                                className='w-full p-3 rounded-lg bg-slate-800 text-white'
                                placeholder='Enter Amount' />

                            <button onClick={() => pay(Number.parseInt(paymentform.amount) * 100)}
                                className="text-white bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg px-5 py-2.5"
                                disabled={paymentform.name?.length < 3 || paymentform.message?.length < 4 || paymentform.amount?.length<1}>
                                Pay
                            </button>

                        </div>

                        <div className='flex flex-col md:flex-row gap-2 mt-5'>
                            <button className='bg-slate-800 text-white p-3 rounded-lg' onClick={() => pay(1000)}>Pay ₹10</button>
                            <button className='bg-slate-800 text-white p-3 rounded-lg' onClick={() => pay(2000)}>Pay ₹20</button>
                            <button className='bg-slate-800 text-white p-3 rounded-lg' onClick={() => pay(3000)}>Pay ₹30</button>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default PaymentPage