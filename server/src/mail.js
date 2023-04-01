const nodemailer = require('nodemailer');
const fs = require('fs');
const { count } = require('console');
// const {affectedArea} = ;
var counter = 0;
function sendEmail(){
    if(counter == 0)
    {
    const transporter = nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: 'asthmabois@hotmail.com',
            pass: 'LucIsVenom1!'
        }
    });
    var emailee = fs.readFileSync('email.txt').toString().split("\n");
    // Can just add groups and if statements to expand to other locations
    
    const mailOptions = {
        from: 'asthmabois@hotmail.com',
        to: emailee.join(','),
        subject: 'Fire Alert!',
        text: 'A fire has been detected in your area. Please take necessary precautions.'
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    }
    counter++;

}

module.exports = {
    sendEmail
}