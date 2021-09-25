const db = require("../models");
const Op = db.Sequelize.Op;
const Admin = db.admin;
const TestCenter = db.testCenter;
const DateSlot = db.dateSlot;
const TimeSlot = db.timeSlot;
const Application = db.application;
const {DEFAULT_LIMIT} = require("../config");
const {sendMail, sendMailAppointmentConfirm} = require("../utils/email");
const {germanTimeFormat, germanDateFormat} = require("../utils");
const makeMailFromTemplate = require("../utils/email/mailTemplate");
const formSubmitMailTemplate = require("../utils/email/formSubmiMailTemplate");
const PDFDocument = require('pdfkit');
const fs = require('fs');

/**
 * Register Application
 * @url /application/register
 * @param req
 * @param res
 * @returns
 */
exports.registerApplication = async (req, res) => {
    try {
        const data = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            gender: req.body.gender,
            birthDay: req.body.birthday,
            IDNumber: req.body.IDNumber,
            address: req.body.address,
            testCenterId: req.body.testCenterId,
            bookingDate: req.body.bookingDate,
            bookingTime: req.body.bookingTime,
            zipcode: req.body.zipCode,
            street: req.body.street,
            // timeSlotId: req.body.timeSlotId,
            active: 1
        }

        const application = await Application.create(data);

        res.status(200).json({result: application.id});

        // sending mail
        const testCenter = await TestCenter.findOne({
            where: {id: req.body.testCenterId},
        });

        const info = {
            id: application.id,
            firstName: application.firstName,
            lastName: application.lastName,
            email: application.email,
            phoneNumber: application.phoneNumber,
            gender: application.gender,
            birthDay: application.birthDay,
            IDNumber: application.IDNumber,
            address: application.address,
            zipcode: application.zipcode,
            street: application.street,
            testCenterId: application.testCenterId,
            bookingDate: application.bookingDate,
            bookingTime: application.bookingTime,
            testCenterAddress: testCenter.address,
        }

        return sendMailAppointmentConfirm(
            application,
            'Termin Bestätigung / Appointment Confirmation',
            formSubmitMailTemplate(info)
        );
    } catch (err) {
        console.log(err)
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
};

exports.getApplicationsByFilter = async (req, res) => {
    const selectedDate = new Date(req.body.selectedDate).getTime();
    const selectedSlot = req.body.selectedSlot;
    const testCenterId = req.body.testCenterId;
    const curDate = selectedDate - (selectedDate % (24 * 3600000));

    try {
        const applications = await Application.findAndCountAll({
            where: {
                bookingDate: {
                    [Op.and]: [
                        {[Op.gte]: curDate},
                        {[Op.lt]: curDate + 24 * 3600000}
                    ]
                },
                testCenterId: testCenterId,
                active: 1
            },
            include: [{
                model: TestCenter,
            }]
        })
        return res.status(200).json({result: applications});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.getApplicationHistory = async (req, res) => {
    try {
        let filter = {};
        if (req.body.status > 1) filter.status = req.body.status;
        else filter.status = {[Op.gt]: 1};

        let start, end;
        if (req.body.searchDate) {
            start = new Date(req.body.searchDate).getTime();
            end = start + 24 * 3600000;
            console.log('date: ', req.body.searchDate);
            filter.updatedDate = {
                [Op.gte]: start,
                [Op.lt]: end
            }
        }

        console.log(filter)

        const data = await Application.findAndCountAll({
            limit: req.body.limit || DEFAULT_LIMIT,
            offset: req.body.offset || 0,
            where: filter,
            include: [{
                model: TestCenter,
                attributes: ['id', 'name'],
            }]
        });

        return res.status(200).json({result: data});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.getApplicationById = (req, res) => {
    Application.findOne({
        where: {
            id: req.body.applicationId || 0,
            active: 1,
        },
        include: {
            model: TestCenter,
        }
    }).then((data) => {
        return res.status(200).json({result: data});
    }).catch(err => {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    })
}

exports.updateApplication = async (req, res) => {
    console.log(req.body)
    const applicationId = req.body.applicationId || 0;
    try {
        const application = await Application.findOne({
            where: {id: applicationId}
        });

        for (const key of Object.keys(req.body)) {
            if (key !== 'applicationId') {
                application[key] = req.body[key];
            }
        }

        application.updatedDate = new Date();
        if (req.body.status && req.body.status === 1) {
            application.checkinDate = new Date();
        }
        await application.save();

        return res.status(200).json({result: application});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

// exports.completeApplication = async (req, res) => {
//     const applicationId = req.body.applicationId || 0;
//     const adminName = req.body.adminName;
//
//     try {
//         const application = await Application.findOne({
//             where: {id: applicationId},
//             include: [{
//                 model: TestCenter
//             }]
//         });
//
//         application.completed = 1;
//         application.updatedDate = new Date();
//         await application.save();
//
//         //sending mail
//         sendMail(
//             res,
//             application,
//             'Ergebnis Ihres Schnelltests / Your test result',
//             makeMailFromTemplate(application, adminName)
//         );
//
//     } catch (err) {
//         console.log(err)
//         return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
//     }
// }

exports.completeApplication = async (req, res) => {
    const applicationId = req.body.applicationId || 0;
    const adminName = req.body.adminName || 'Mohmd Alkhalawi';
    const adminId = req.body.adminId || 0;

    try {
        const application = await Application.findOne({
            where: {id: applicationId},
            include: [{
                model: TestCenter
            }]
        });

        application.completed = 1;
        application.updatedDate = new Date();
        await application.save();

        res.status(200).json({result: application.id, msg: "MAIL_SENDING_SUCCESS"});

        //create pdf and sending mail
        const result = application.status === 2 ? 'Positiv / Positive' : 'Negativ / Negative';
        const resultColor = application.status === 2 ? '#fe4e60' : '#1e7e34';
        const gender = application.gender === 'male' ? 'Männlich / male' : application.gender === 'female' ? 'Weiblich / female' : 'Divers / diverse';
        let stamp;
        if (application.testCenter && application.testCenter.stamp) {
            stamp = application.testCenter.stamp.split('public/files/')[1];
        } else {
            stamp = 'berlin-logo.png';
        }

        const doc = new PDFDocument();
        const fileName = `${adminId}_${new Date().getTime()}.pdf`;
        doc.pipe(fs.createWriteStream(`./public/files/${fileName}`));

        doc.image('./public/files/berlin-logo.png', 60, 30, {width: 120, align: 'right'});
        const delta0 = 30;
        const delta = 70;
        doc
            .fontSize(10)
            .text('Abraz Dream GmbH, Boxberger Str. 3, D-12681 Berlin', 60, 60 + delta0)
            .text(`${germanDateFormat(application.updatedDate)}`, 60, 60 + delta0, {align: "right"})
            .text(`Bescheinigung über das Vorliegen eines positiven oder negativen Antigentests zum Nachweis des SARS-CoV-2 Virus`, 60, 90 + delta0)
            .text(`Name / Name : `, 60, 120 + delta0).text(`${application.firstName} ${application.lastName}`, 200, 120 + delta0)
            .text(`Geschlecht / Gender: `, 60, 140 + delta0).text(`${gender}`, 200, 140 + delta0)
            .text(`Geburtsdatum / Date of Birth: `, 60, 160 + delta0).text(`${germanDateFormat(application.birthDay)}`, 200, 160 + delta0)
            .text(`Ausweisnummer / ID Number: `, 60, 180 + delta0).text(`${application.IDNumber}`, 200, 180 + delta0)
            .text(`Anschrift / Address: `, 60, 200 + delta0).text(`${application.address}, ${application.zipcode} ${application.street}`, 200, 200 + delta0)
            .text(`Testort / Test Location: `, 60, 180 + delta).text(`${application.testCenter && application.testCenter.name} ${application.testCenter && application.testCenter.address}`, 200, 180 + delta)
            .text(`Test-/Probentyp / Test Type: `, 60, 200 + delta).text(`SARS-CoV-2 Ag Test | oro-/nasopharyngeal(er) Abstrich / swab `, 200, 200 + delta)
            .text(`Hersteller / Producer: `, 60, 220 + delta).text(`Nal von Minden `, 200, 220 + delta)
            .text(`Testname / Test name: `, 60, 240 + delta).text(`NADAL COVID-19 AG Test `, 200, 240 + delta)
            .text(`Bestellnummer / Order No: `, 60, 260 + delta).text(`${application.id}`, 200, 260 + delta)
            .text(`Testzeitpunkt / Test time: `, 60, 280 + delta).text(`${application.checkinDate ? germanTimeFormat(application.checkinDate) : ''}`, 200, 280 + delta)
            .text(`Testergebnis / Test Result: `, 60, 320 + delta)
            .fillColor(`${resultColor}`).text(`${result}`, 60, 355 + delta, {align: 'center'})
            .fillColor('#000000').text(`SARS-CoV-2 Antigen Test (Lateral Flow Method)`, 60, 390 + delta)
            .text(`Wer dieses Dokument fälscht oder einen nicht erfolgten Test unrichtig bescheinigt, macht sich nach § 267 StGB der Urkundenfälschung strafbar. Jeder festgestellte Verstoß wird zur Anzeige gebracht. Wer ein gefälschtes Dokument verwendet, um Zugang zu einer Einrichtung oder einem Angebot zu erhalten, begeht nach der Coronaschutzverordnung des Landes eine Ordnungswidrigkeit, die mit einer Geldbuße in Höhe von 1000€ geahndet wird. `, 60, 410 + delta)
            .text(`----------------------------------------------------------------------------------------------`)
            .text(`*Bei einem positiven Ergebnis muss sich die Personen unmittelbar in Quarantäne begeben. Dies gilt auch für Haushaltsangehörige von Personen mit einem positiven Schnelltest. Die Quarantäne darf erst beendet werden, wenn ein nachfolgender PCR-Test ein negatives Ergebnis hat. Die positiv getestete Person hat zur Bestätigung oder auch Widerlegung Anspruch auf einen PCR-Test.`)
            .text(`EMPFEHLUNG: Um das Risiko einer Infektion so gering wie möglich zu halten, empfehlen wir Ihnen sich weiterhin an die Vorgaben der Bundeszentrale für gesundheitliche Aufklärung (BZgA): https://www.infektionsschutz.de/ zu halten.`)
            .text(`RECOMMENDATIONs: In order to keep the risk of infection as low as possible, we recommend that you continue to follow the requirements of the Federal Center for Health Education(BZgA): https://www.infektionsschutz.de/. `)
            .text(`${application.testCenter && application.testCenter.name}`, 60, 610 + delta)
            .text(`${application.testCenter && application.testCenter.address}`)
            .text(`${adminName}`);

        doc
            .save()
            .moveTo(60, 340 + delta)
            .lineTo(550, 340 + delta)
            .lineTo(550, 380 + delta)
            .lineTo(60, 380 + delta)
            .lineTo(60, 340 + delta)
            .stroke(`${resultColor}`)

        doc.image(`./public/files/${stamp}`, 300, 610 + delta, {width: 120, align: 'right'});

        doc.end();

        return sendMail(
            application,
            fileName,
            `Ergebnis/Test result - ${application.firstName} ${application.lastName}, Test ID ${application.id}`,
            makeMailFromTemplate(application, adminName)
        );

    } catch (err) {
        console.log(err)
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.finishApplicantTest = async (req, res) => {
    try {
        const applicationId = req.body.applicationId || 0;
        const application = await Application.findOne({
            where: {id: applicationId}
        });
        if (application) {
            application.updatedDate = new Date();
            await application.save();
        }
        return res.status(200).json({result: 'UPDATE_SUCCESS'})
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}
