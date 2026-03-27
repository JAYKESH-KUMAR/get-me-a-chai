"use server"

import Razorpay from "razorpay"
import Payment from "@/models/Payment"
import connectDb from "@/db/connectDb"
import User from "@/models/User"

// INITIATE PAYMENT (SAFE)
export const initiate = async (amount, to_username, paymentform) => {
    try {
        await connectDb()

        if (!to_username) throw new Error("Username missing")

        let user = await User.findOne({
            username: to_username.toLowerCase()
        }).lean()

        if (!user) {
            throw new Error("User not found")
        }

        if (!user.razorpayid || !user.razorpaysecret) {
            throw new Error("Razorpay details missing")
        }

        const instance = new Razorpay({
            key_id: user.razorpayid,
            key_secret: user.razorpaysecret
        })

        let options = {
            amount: Number(amount),
            currency: "INR",
        }

        let x = await instance.orders.create(options)

        await Payment.create({
            oid: x.id,
            amount: amount / 100,
            to_user: to_username.toLowerCase(),
            name: paymentform?.name || "Anonymous",
            message: paymentform?.message || ""
        })

        return x

    } catch (err) {
        console.log("INITIATE ERROR:", err)
        throw err
    }
}


// FETCH USER (NO CRASH)
export const fetchuser = async (username) => {
    try {
        await connectDb()

        if (!username) return null

        let u = await User.findOne({
            username: username.toLowerCase()
        }).lean()

        return u || null

    } catch (err) {
        console.log("fetchuser error:", err)
        return null
    }
}


// FETCH PAYMENTS (SAFE)
export const fetchpayments = async (username) => {
    try {
        await connectDb()

        if (!username) return []

        let p = await Payment.find({
            to_user: username.toLowerCase(),
            done: true
        })
            .sort({ amount: -1 })
            .limit(10)
            .lean()

        return p.map(item => ({
            ...item,
            _id: item._id.toString()
        })) || []

    } catch (err) {
        console.log("fetchpayments error:", err)
        return []
    }
}


//  UPDATE PROFILE (FINAL SAFE)
export const updateProfile = async (data, oldusername) => {
    try {
        await connectDb()

        if (!data?.email) {
            return { error: "Email missing" }
        }

        const ndata = data

        const updateData = {
            name: ndata.name || "",
            username: ndata.username?.toLowerCase()?.trim() || "",
            profilepic: ndata.profilepic || "",
            coverpic: ndata.coverpic || "",
            razorpayid: ndata.razorpayid || "",
            razorpaysecret: ndata.razorpaysecret || "",
        }

        // Username change case
        if (oldusername !== updateData.username) {

            let existing = await User.findOne({
                username: updateData.username
            })

            if (existing) {
                return { error: "Username already exists" }
            }

            await User.updateOne(
                { email: ndata.email },
                { $set: updateData }
            )

            await Payment.updateMany(
                { to_user: oldusername },
                { to_user: updateData.username }
            )

        } else {
            await User.updateOne(
                { email: ndata.email },
                { $set: updateData }
            )
        }

        return { success: true }

    } catch (err) {
        console.log("updateProfile error:", err)
        return { error: "Server error" }
    }
}