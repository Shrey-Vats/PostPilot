import { Auth } from "@auth/core";
import CredentialsProvider from "@auth/core/providers/credentials";
import Email from "@auth/core/providers/email";
import User from "../models/user";

export const authHeaders = async (req, res) => {
    return await Auth(req, res, {
      secret: "",
      providers: [
        CredentialsProvider({
          name: "credentials",
          credentials: {
            Email: { label: "Email", type: "Email", placeholder: "Email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials) {
            try {
              const { Email, password } = credentials;

              const user = await User.findOne({ email: Email });

              if (!user) {
                throw new Error("User not found, Signup first");
              }

              if (user.isVerified === false) {
                throw new Error("User not verified, Please verify your email");
              }

              const isPasswordMatch = await bcrypt.compare(
                password,
                user.password
              );

              if (!isPasswordMatch) {
                throw new Error("Invalid Password");
              }

              return user;
            } catch (error) {
              throw new Error(error.message);
            }
          },
          session: {
            strategy: "jwt",
          },

          callback: {
            async jwt({ token, user}) {
                if(!user){
                    throw new Error("User not found")
                }

                token._id = user._id;
                token.email = user.email;
                token.role = user.role;

                return token
            },

            async session({session, token}) {
                if(!session.user){
                    throw new Error("User not found")
                }
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.role = token.role;
                return session
            }
          }
        }),
      ],
    });
};