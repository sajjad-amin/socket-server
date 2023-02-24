const nodeMailer = require("nodemailer");

class Email {
    constructor() {
        this.transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false
            }
        });
    }

    send = (email,subject,body,html=false,cb=null) => {
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: email,
            subject: subject,
        };
        if(html){
            mailOptions.html = body;
        }else{
            mailOptions.text = body;
        }
        this.transporter.sendMail(mailOptions).then((info) => {
            cb && cb(null,info);
        }).catch((err) => {
            cb && cb(err,null);
        });
    }
}

module.exports = Email;