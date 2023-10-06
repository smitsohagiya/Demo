import nodeMailer from "nodemailer";

export default async function sendMail(email: any, subject: any, html: any) {
    return new Promise((resolve, reject) => {
        const transporter = nodeMailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });
        
        const options = {
            to: email,
            subject: subject,
            html: html,
        };
        
        transporter.sendMail(options, (error, result) => {
            if (error) {
                console.log(error
                );

                reject(() => {
                    console.log(error);
                })
            } else {

                resolve(() => {
                    console.log("Mail sent:", result.response)
                })
            }
        });
    });
}