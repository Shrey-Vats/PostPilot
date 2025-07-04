import e from "express";
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken'

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

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User does not exit",
        success: false,
      });
    }
    const isMatch = bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Passowrd, Try again",
        success: false,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    
  

  } catch (error) {
    return res.status(500).json({
        message: "Error during Login,", error,
        success: false
    })
  }
}