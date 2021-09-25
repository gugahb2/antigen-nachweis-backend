const {PENDING_EXPIRATION} = require("../../config")
const nodeMailer = require("nodemailer");
const mailConfig = {
    service: 'gmail',
    port: 587,
    name: 'smtp.gmail.com',
    host: 'smtp.gmail.com',
    secure: false,
    // requireTLS: true,
    auth: {
        user: 'antigen.nachweis@gmail.com',
        pass: 'Start100$'
    }
};

const testMailConfig = {
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'graham.jones75@ethereal.email',
        pass: 'XRaqpZNjGMxfGGmbWy'
    }
};

const transporter = nodeMailer.createTransport(mailConfig);
// const transporter = nodeMailer.createTransport(testMailConfig);

exports.sendMail = (application, fileName, subject, content) => {
    console.log(application.id);
    console.log(application.email);
    console.log(fileName);

    const to = application.email;
    const user_name = application.firstName + ' ' + application.lastName;

    transporter.sendMail({
        from: 'Antigen-Nachweis <antigen.nachweis@gmail.com>',
        to: `${user_name} <${to}>`,
        subject: subject,
        text: `Dear ${user_name}!`,
        html: content,
        attachments: [{
            filename: 'test_report.pdf',
            path: `./public/files/${fileName}`,
            contentType: 'application/pdf',
        }]
    }, function (err, info) {
        if (err) {
            console.log(err);
            return {msg: "MAIL_SENDING_FAILED", err: err.toString()};
        } else {
            console.log('mail sending success...');
            return {result: application.id, msg: "MAIL_SENDING_SUCCESS"};
        }
    });
};


exports.sendMailAppointmentConfirm = (application, subject, content) => {
    console.log(application.id);
    console.log(application.email);

    const to = application.email;
    const user_name = application.firstName + ' ' + application.lastName;

    transporter.sendMail({
        from: 'Antigen-Nachweis <antigen.nachweis@gmail.com>',
        to: `${user_name} <${to}>`,
        subject: subject,
        text: `Dear ${user_name}!`,
        html: content,
    }, function (err, info) {
        if (err) {
            console.log(err)
            return {msg: "MAIL_SENDING_FAILED", err: err.toString()};
        } else {
            console.log('mail sending success...')
            return {result: application.id, msg: "MAIL_SENDING_SUCCESS"};
        }
    });
};

// module.exports = sendMail;
