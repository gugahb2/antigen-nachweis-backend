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

exports.getTimeSlotsByCenter = async (req, res) => {
    const testCenterId = req.body.testCenterId || 0;
    console.log('testCenterId: ', testCenterId)

    try {
        const dateSlots = await DateSlot.findAll({
            where: {
                testCenterId: testCenterId,
                active: 1,
            },
            include: [{
                model: TimeSlot,
            }],
            order: [[TimeSlot, 'startTime', 'ASC']],
        });

        console.log('length: ', dateSlots.length)

        return res.status(200).json({result: dateSlots});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.getTimeSlotById = async (req, res) => {
    const dateSlotId = req.body.dateSlotId || 0;

    try {
        const dateSlot = await DateSlot.findOne({
            where: {
                id: dateSlotId,
                active: 1,
            },
            include: [{
                model: TimeSlot,
            }]
        });

        return res.status(200).json({result: dateSlot});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}


exports.registerTimeSlots = async (req, res) => {
    try {
        const testCenterId = req.body.testCenterId;
        const weekdays = req.body.weekdays;
        const capacity = req.body.capacity;
        const timeSlots = JSON.parse(req.body.timeSlots);

        const dateSlot = await DateSlot.create({
            testCenterId,
            weekdays,
            capacity,
        });

        const slotData = [];
        for (const item of timeSlots) {
            slotData.push({
                dateSlotId: dateSlot.id,
                startTime: item.startTime,
                endTime: item.endTime,
                testDuration: item.testDuration,
                checkinInterval: item.checkinInterval,
            })
        }

        await TimeSlot.bulkCreate(slotData, {returning: true});

        return res.status(200).json({result: dateSlot.id});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.updateTimeSlots = async (req, res) => {
    try {
        const dateSlotId = req.body.dateSlotId;
        const testCenterId = req.body.testCenterId;
        const weekdays = req.body.weekdays;
        const capacity = req.body.capacity;
        const timeSlots = JSON.parse(req.body.timeSlots);

        const dateSlot = await DateSlot.findOne({
            where: {id: dateSlotId}
        });

        if (!dateSlot) {
            return res.status(404).send({msg: 'TIMESLOT_NOT_FOUND'});
        }

        dateSlot.testCenterId = testCenterId;
        dateSlot.weekdays = weekdays;
        dateSlot.capacity = capacity;
        await dateSlot.save();

        await TimeSlot.destroy({
            where: {dateSlotId: dateSlotId}
        });

        const slotData = timeSlots.map(x => ({
            dateSlotId: dateSlot.id,
            startTime: x.startTime,
            endTime: x.endTime,
            testDuration: x.testDuration,
            checkinInterval: x.checkinInterval,
        }));

        await TimeSlot.bulkCreate(slotData, {returning: true});

        return res.status(200).json({result: dateSlot.id});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.deleteTimeSlot = async (req, res) => {
    const dateSlotId = req.body.dateSlotId || 0;

    try {
        const cnt = await DateSlot.destroy({
            where: {
                id: dateSlotId,
            }
        });

        await TimeSlot.destroy({
            where: {
                dateSlotId: dateSlotId,
            }
        });

        return res.status(200).json({result: cnt, msg: 'DELETE_SUCCESS'});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

