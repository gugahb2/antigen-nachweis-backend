const express = require('express');
const router = express.Router();
const db = require("./models");
const Op = db.Sequelize.Op;
const Application = db.application;
const {APP_URL} = require("./config");

router.all('/applicant', async (req, res, next) => {
    const testCenterId = req.query.test_center_id;
    console.log('testCenterId: ', testCenterId)

    if (testCenterId) {
        res.redirect(`${APP_URL}/${testCenterId}`);
    } else {
        res.redirect('');
    }
});

router.all('/check-in', async (req, res, next) => {
    const email = req.query.email;
    if (email) {
        const application = await Application.findOne({
            where: {email: email}
        });

        if (application.status === 0) {
            application.status = 1;
            await application.save();

            return res.status(200).json({result: 'CHECKIN_SUCCESS'});
        }

        return res.status(200).json({result: 'ALREADY_CHECKED_IN'});
    }
    return res.status(404).json({result: 'APPLICATION_NOT_FOUND'});
});


module.exports = router;
