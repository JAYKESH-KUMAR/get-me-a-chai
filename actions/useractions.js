
"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"

export const initiate = async (amount, to_username, paymentform) => {
    await connectDb()

    let user = await User.findOne({ username: to_username.toLowerCase() })

    if (!user) {
        throw new Error("User not found")   
    }

    const secret = user.razorpaysecret

    var instance = new Razorpay({ 
        key_id: user.razorpayid, 
        key_secret: secret 
    })

    let options = {
        amount: Number.parseInt(amount),
        currency: "INR",
    }

    let x = await instance.orders.create(options)

    await Payment.create({
        oid: x.id,
        amount: amount / 100,
        to_user: to_username,
        name: paymentform?.name || "Anonymous",     
        message: paymentform?.message || ""
    })

    return x
}


export const fetchuser = async (username) => {
    await connectDb()

    if (!username) return null  

    let u = await User.findOne({ username: username.toLowerCase() })

    if (!u) return null          

    let user = u.toObject({ flattenObjectIds: true })
    return user
}


export const fetchpayments = async (username) => {
    await connectDb()

    if (!username) return []   

    let p = await Payment.find({
        to_user: username.toLowerCase(),
        done: true
    })
    .sort({ amount: -1 })
    .limit(10)
    .lean()

    p = p.map(item => ({
        ...item,
        _id: item._id.toString()
    }))

    return p || []  
}


export const updateProfile = async (data, oldusername) => {
    await connectDb()

    let ndata = data 

    if (oldusername !== ndata.username) {
        let u = await User.findOne({ username: ndata.username })

        if (u) {
            return { error: "Username already exists" }
        }

        await User.updateOne({ email: ndata.email }, ndata)

        await Payment.updateMany(
            { to_user: oldusername },
            { to_user: ndata.username }
        )

    } else {
        await User.updateOne({ email: ndata.email }, ndata)
    }
}