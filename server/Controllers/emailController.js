const nodemailer = require('nodemailer');
const User = require('../ModelsSchema/userModel');

async function Email(req, res) {
    const { voterId, otp } = req.body;

   if(voterId && otp){
    const userEmail = await User.findOne({voterId});
    // console.log(userEmail)

    if(!userEmail){
        return res.status(400).json({ message : "Voter Id Not Found" });
    }

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.from,
            pass: process.env.pass
        }
    });


    const mailOptions = {
        from: process.env.from,
        to: userEmail.email,
        subject: "Verification of user to login",
        text: `OTP : ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.json({message : 'Email sent', user : userEmail});
        }
    });
   }else{

    const { email, candidate, constituency, vote } = req.body;

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.from,
            pass: process.env.pass
        }
    });


    const mailOptions = {
        from: process.env.from,
        to: email,
        subject: "Verification of user to login",
        text: `
        ${constituency.district ? "District" : ""} : ${constituency.district || ""}
            Election_type : ${vote === 1 ? "MLA" : "MP"}
            Constituency_name : ${constituency.name}
            Candidate_name : ${candidate.name}
            Candidate_party : ${candidate.party}
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.status(500).send('Error sending email');
        } else {
            console.log('Email sent: ' + info.response);
            res.json({message : 'Email sent', user : userEmail});
        }
    });
   }
}

module.exports = Email;