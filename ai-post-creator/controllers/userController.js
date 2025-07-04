import e from "express";
import User from '../models/user.js'
import bcrypt from 'bcrypt'
import { sendEmail } from "../utils/mailer.js";
import jwt from 'jsonwebtoken'
import { inngest } from "../inngest/client.js";

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

        const key = await bcrypt.hash(user_id, 10)

        const newUser = await User.create({
          email,
          password: hashedPassword
        })

        await inngest.send({
          name: "user/signup-complete",
          data: {
            email, key
          },
        });

        await inngest.send({
          name: "user/signing-up",
          data: {
            email,
          },
        });

        const token = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
          },
          process.env.JWT_SECRET
        );

        return res.status(200).json({
            message: "successfuly user created",
            success: true,
            token
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

    // res.cookie("token", token, {
    //   httpOnly: true, 
    //   maxAge: 24 * 60 * 60 * 1000 * 29, // 29 day
    // });



    res.status(200).json({
      message: "Login Successfuly",
      success: "true",
      token
    })
  

  } catch (error) {
    return res.status(500).json({
        message: "Error during Login,", error,
        success: false
    })
  }
}

export const Logout = async (req, res) => {
  try {
    // res.clearCookie("token");

    // return res.status(200).json({
    //   message: "Logout successfuly",
    //   success: true,
    // });

    const token = req.headers.authorization.split(" ")[1]

    if(!token){
      return res.status(401).json({
        message: "Unauthorize",
        success: false
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decorded)=>{
      if(err) return res.status(400).json({message: "Invalid token", success:false})

        return res.status(200).json({
          message: "Logout successful",
          success: false
        })
    })

  } catch (error) {
    return res.status(500).json({
      message: "Lougout failed, Try again",
      error: error,
      success: false
    })
  }
}

export const getUserProfile = async (req, res) => {
  const decorded = req.user;

  try {
    const user = await User.findOne({ _id: decorded.userId }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "user no longer exits",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User Informations:",
      user,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "User data failed",
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  const { role, email } = req.body;

  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        message: "error forbiden",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User does not exit !",
      });
    }

    await User.updateOne({ email }, { role });

    return res.status(200).json({
      message: "User Updated successfuly",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Update failed",
      success: false,
    });
  }
};