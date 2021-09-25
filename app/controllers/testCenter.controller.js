const db = require("../models");
const Admin = db.admin;
const TestCenter = db.testCenter;
const DateSlot = db.dateSlot;
const TimeSlot = db.timeSlot;
const {DEFAULT_LIMIT} = require("../config");


/**
 * Register Test Center
 * @url /test-center/register
 * @param req
 * @param res
 * @returns
 */
exports.registerTestCenter = async (req, res) => {
    try {
        const testCenter = await TestCenter.create({
            name: req.body.name,
            address: req.body.address,
            stamp: req.body.stamp,
            createdDate: new Date(),
            active: 1
        });

        return res.status(200).json({result: testCenter});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
};

exports.getAllTestCenter = async (req, res) => {
    try {
        const testCenters = await TestCenter.findAll({
            where: {
                active: 1
            },
            attributes: ['id', 'name', 'address']
        })
        return res.status(200).json({result: testCenters});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.getTestCenterByFilter = async (req, res) => {
    try {
        const testCenters = await TestCenter.findAndCountAll({
            limit: req.body.limit || DEFAULT_LIMIT,
            offset: req.body.offset || 0,
            where: {
                active: 1
            }
        })
        return res.status(200).json({result: testCenters});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}


exports.getTestCenterById = async (req, res) => {
    try {
        const testCenter = await TestCenter.findOne({
            where: {
                id: req.body.testCenterId,
                active: 1,
            }
        });

        return res.status(200).json({result: testCenter});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.updateTestCenter = async (req, res) => {
    const testCenterId = req.body.testCenterId || 0;

    try {
        const testCenter = await TestCenter.findOne({
            where: {
                id: testCenterId,
            }
        });

        const keys = Object.keys(req.body);

        for (const key of keys) {
            if (key !== 'testCenterId') {
                testCenter[key] = req.body[key];
            }
        }

        await testCenter.save();

        return res.status(200).json({msg: 'UPDATE_SUCCESS'});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.deleteTestCenter = async (req, res) => {
    const testCenterId = req.body.testCenterId || 0;

    try {
        const testCenter = await TestCenter.findOne({
            where: {
                id: testCenterId,
                active: 1,
            }
        });

        testCenter.active = 0;
        await testCenter.save();

        return res.status(200).json({result: testCenter.id, msg: 'DELETE_SUCCESS'});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}
