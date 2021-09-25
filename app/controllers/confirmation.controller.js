const db = require("../models");
const Confirmation = db.confirmation;
const TestCenter = db.testCenter;
const {DEFAULT_LIMIT} = require("../config");
const Op = db.Sequelize.Op;


exports.submitConfirmation = (req, res) => {
    Confirmation.create({
        bookingID: req.body.bookingID,
        testDate: req.body.testDate,
        testCenterId: req.body.testCenterId || 0,
        tickbox1: req.body.tickbox1,
        tickbox2: req.body.tickbox2,
        tickbox3: req.body.tickbox3,
    }).then(data => {
        return res.status(200).json({result: 'SUCCESS_REGISTER'});
    }).catch(err => {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    })
}

exports.getConfirmationByFilter = async (req, res) => {
    const fromDate = req.body.fromDate;
    const toDate = req.body.toDate;

    try {
        const from = fromDate ? new Date(fromDate).getTime() : 0;
        const to = toDate ? new Date(toDate).getTime() : (new Date()).getTime();
        const filter = {
            testDate: {[Op.gte]: from, [Op.lt]: to},
        }
        const confirmations = await Confirmation.findAndCountAll({
            limit: req.body.limit || 1000000,
            offset: req.body.offset || 0,
            where: filter,
            include: [{
                model: TestCenter,
            }]
        });

        return res.status(200).json({result: confirmations});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }   
}