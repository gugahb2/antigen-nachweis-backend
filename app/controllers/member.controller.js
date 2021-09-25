const db = require("../models");
const Admin = db.admin;
const TestCenter = db.testCenter;
const bcrypt = require("bcryptjs");
const {DEFAULT_LIMIT} = require("../config");
const validateSignupInput = require("../validations/signup.validation")


/**
 * Register Member
 * @url /member/register
 * @param req
 * @param res
 * @returns
 */
exports.registerMember = async (req, res) => {

    const {msg, isValid} = validateSignupInput(req.body);
    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    try {
        const user = await Admin.findOne({
            where: {
                adminID: req.body.adminID,
                active: 1,
            }
        });

        if (user) {
            return res.status(400).json({msg: "ADMIN_ID_DUPLICATED"});
        }

        const newUser = {
            adminID: req.body.adminID,
            role: 2,
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            testCenterId: req.body.testCenterId,
            createdDate: new Date(),
            active: 1,
        };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                Admin.create(newUser)
                    .then(async user => {
                        return res.status(200).json({result: user});
                    })
                    .catch(err => {
                        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
                    });
            });
        });
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
};

exports.getAllMember = async (req, res) => {
    try {
        const members = await Admin.findAll({
            where: {
                active: 1
            },
            attributes: ['id', 'name']
        });
        return res.status(200).json({result: members});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.getMemberByFilter = async (req, res) => {
    try {
        const members = await Admin.findAndCountAll({
            limit: req.body.limit || DEFAULT_LIMIT,
            offset: req.body.offset || 0,
            where: {
                active: 1
            },
            include: [{
                model: TestCenter,
                attributes: ['id', 'name'],
            }]
        })
        return res.status(200).json({result: members});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}


exports.getMemberById = async (req, res) => {
    try {
        const member = await Admin.findOne({
            where: {
                id: req.body.memberId,
                active: 1,
            }
        });

        return res.status(200).json({result: member});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.updateMember = async (req, res) => {
    const memberId = req.body.memberId || 0;

    try {
        const member = await Admin.findOne({
            where: {id: memberId, active: 1}
        });

        const keys = Object.keys(req.body);

        for (const key of keys) {
            if (key !== 'memberId' && key !== 'password') {
                member[key] = req.body[key];
            }
        }

        if (req.body.password && req.body.password !== '') {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(req.body.password, salt, async (err, hash) => {
                    if (err) throw err;
                    member.password = hash;
                    await member.save();
                    return res.status(200).json({result: member.id});
                });
            });
        } else {
            await member.save();
            return res.status(200).json({result: member.id});
        }
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}

exports.deleteMember = async (req, res) => {
    const memberId = req.body.memberId || 0;

    try {
        const member = await Admin.findOne({
            where: {
                id: memberId,
                active: 1,
            }
        });

        member.active = 0;
        await member.save();

        return res.status(200).json({result: member.id, msg: 'DELETE_SUCCESS'});
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
}
