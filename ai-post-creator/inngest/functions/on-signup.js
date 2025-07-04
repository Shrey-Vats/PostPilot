import { inngest } from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import { sendEmail } from "../../utils/mailer.js";

export const onUserSignup = inngest.createFunction(
    {id: "on-user-signup", retries: 2},
    {event: "user/signup"},
    async ({event, step}) => {
        try {
            const {email} = event.data

            const user = await step.run("get-user-email", async () => {
                const userObject = await User.findOne({email})
                if(!userObject){
                    throw new NonRetriableError("User no longer exits")
                }
                return userObject
            })

            await step.run("send-welcom-email", async () => {
                const subject = "Welcome to the "
                const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Welcome Email</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; padding: 30px; border-radius: 8px;">
            <tr>
              <td align="center" style="padding-bottom: 20px;">
                <h2 style="color: #333333; margin: 0;">👋 Welcome to <span style="color: #007BFF;">PostPilot</span></h2>
              </td>
            </tr>
            <tr>
              <td style="font-size: 16px; color: #555555; text-align: center;">
                <p style="margin-bottom: 20px;">Hi there,</p>
                <p style="margin-bottom: 20px;">
                  Thanks for signing up for <strong>PostPilot</strong> — your personal AI agent that makes posting on X (Twitter), LinkedIn, and beyond effortless.
                </p>
                <p style="margin-bottom: 30px;">
                  You're now ready to automate your content, save time, and grow your presence!
                </p>
                <a href="https://yourwebsite.com/dashboard" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a>
              </td>
            </tr>
            <tr>
              <td style="text-align: center; font-size: 12px; color: #aaaaaa; padding-top: 30px;">
                © 2025 PostPilot. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
                await sendEmail(user.email, subject, html)
            })

            return {success:true}
        } catch (error) {
            console.error("❌ Error during Steps", error.message)
            return {success: false}
        }
    }
)