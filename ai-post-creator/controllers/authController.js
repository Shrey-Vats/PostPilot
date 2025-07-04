import e from "express";
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendEmail } from "../utils/mailer.js";

export const Signup = async (req, res) => {
    try {
        const {email, password} = req.body

        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({
                message: "User already exits",
                success: false
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            email,
            password: hashedPassword,
        })

        const savedUser = await newUser.save()

        // sendEmail(email) logic here

        return res.status(200).json({
            message: "successfuly user created",
            success: true
        })

    } catch (error) {
        return req.status(500).json({
            message: "Error during signup", error,
            success: false
        })
    }
}

