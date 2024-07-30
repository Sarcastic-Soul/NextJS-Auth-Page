import nodemailer from 'nodemailer';
import User from '@/models/user.model';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        const verifyEmailHTML = `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here </a>
        to verify your email or copy and paste the link below in your browser.
        <br>${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>`

        const resetPasswordHTML = `<p>Click <a href="${process.env.DOMAIN}/reset-password?token=${hashedToken}">here </a>
        to reset your password or copy and paste the link below in your browser.<br>
        ${process.env.DOMAIN}/reset-password?token=${hashedToken}</p>`

        if (emailType == "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                $set: { verifyToken: hashedToken, verifyTokenExpiry: new Date(Date.now() + 3600000) }  // expire after 1hr
            }
            )
        } else if (emailType == "RESET") {
            await User.findByIdAndUpdate(userId, {
                set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000 }
            }
            )
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: "08c7ece73c4b30",
                pass: "efb89da6fd8c5e"
            }
        });

        const mailOptions = {
            from: 'nextauthproject@gmail.com',
            to: email,
            subject: emailType === 'VERIFY' ? "Verify your email" : "Reset your password",
            html: emailType === 'VERIFY' ? verifyEmailHTML : resetPasswordHTML,
        }

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {  // avoid using 'any' in TS
        throw new Error(error.message)
    }
}