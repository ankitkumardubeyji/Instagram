import nodemailer from "nodemailer" // module for nodejs application to send emails

import mailgen from "mailgen";// module to generate responsive html emails


// function to send emil
const sendEmail = async function(email,subject,message){
    let testAccount = await nodemailer.createTestAccount(); // creating the test account optional

    // transporter: is the object that will send the email
    let transporter = nodemailer.createTransport({
        service:'gmail', // email service provider
        auth:{
            user:process.env.SMTP_FROM_EMAIL,
            pass:process.env.SMTP_PASSWORD, 
        }
    });


    // configuring mailgen 
    let MailGenerator = new mailgen({
        theme:"default",
        product:{
            name:"Mailgen",
            link:`https://mailgen.js`
        }
    })

    // sandesh : object containing email details 
    let sandesh = {
        from:process.env.SMTP_FROM_EMAIL,
        to:email,
        subject:subject,
        html:message, 
    }

    // sending the email 
    await transporter.sendEmail(sandesh);
}


export {sendEmail};
