const db = require("../models");
const Admin = db.admin;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const validateLoginInput = require("../validations/login.validation");
const validateSignupInput = require("../validations/signup.validation");
const {SECRET_KEY, TOKEN_EXPIRE} = require("../config");

const generateToken = async (user) => {
    const payload = {
        id: user.id,
        adminID: user.adminID,
        role: user.role,
        testCenterId: user.testCenterId,
        createdAt: new Date(),
    };

    // Sign token
    return await jwt.sign(
        payload,
        SECRET_KEY,
        {
            expiresIn: TOKEN_EXPIRE,
        },
    );
}

exports.adminSignUp = async (req, res) => {
    const adminID = req.body.adminID;
    const password = req.body.password;

    try {

        const newUser = {
            adminID: adminID,
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
}

/**
 * Admin Login
 * @url /auth/admin/login
 * @param req keys: {adminID, password}
 * @param res
 * @returns {token}
 */
exports.adminLogin = async (req, res) => {
    const adminID = req.body.adminID;
    const password = req.body.password;

    const {msg, isValid} = validateLoginInput(req.body);
    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    try {
        const admin = await Admin.findOne({
            where: {adminID: adminID},
        });

        if (admin) {
            bcrypt.compare(password, admin.password).then(async isMatch => {
                if (isMatch) {
                    const token = await generateToken(admin);
                    return res.status(200).json({authToken: token});
                } else {
                    return res.status(400).json({msg: "PASSWORD_WRONG"});
                }
            }).catch(err => res.status(500).json({msg: err.toString()}));
        } else {
            return res.status(404).json({msg: "ADMIN_ID_NOT_FOUND"});
        }
    } catch (err) {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    }
};

exports.registerAdmin = async (req, res) => {
    const {msg, isValid} = validateSignupInput(req.body);
    if (!isValid) {
        return res.status(400).json({msg: msg});
    }

    try {
        const user = await Admin.findOne({
            where: {adminID: req.body.adminID}
        });

        if (user) {
            return res.status(400).json({msg: "ADMIN_ID_DUPLICATED"});
        }

        const newUser = {
            adminID: req.body.adminID,
            phone: req.body.phone,
            email: req.body.email,
            role: 2,
        };

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;

                Admin.create(newUser)
                    .then(async user => {
                        const token = await generateToken(user);
                        return res.status(200).json({result: token, adminInfo: user});
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

/**
 * Find the two letter of the password
 * @url "/auth/member/password/find"
 * @param req keys: [phone]
 * @param res
 */
exports.findPassword = (req, res) => {
    const phone = req.body.phone;

    Admin.findOne({
        where: {phone: phone},
        attributes: ['id', 'subPassword']
    }).then(data => {
        if (data) {
            return res.status(200).json({result: data});
        } else {
            return res.status(404).json({msg: "ADMIN_ID_NOT_FOUND"});
        }
    }).catch(err => {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    })
}

/**
 * Reset the password
 * @url "/auth/member/password/reset"
 * @param req keys: [phone, password]
 * @param res
 */
exports.resetPassword = async (req, res) => {
    const adminID = req.body.adminID;
    const password = req.body.password;

    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
            if (err) throw err;

            try {
                const user = await Admin.findOne({
                    where: {
                        adminID: adminID
                    },
                });

                if (user) {
                    user.password = hash;
                    await user.save();

                    return res.status(200).json({result: user.id, msg: 'RESET_PASSWORD_SUCCESS'})
                } else {
                    return res.status(404).json({msg: "ADMIN_ID_NOT_FOUND"});
                }
            } catch (err) {
                // return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
            }

        });
    });
}

exports.getAdminById = (req, res) => {
    Admin.findOne({
        where: {id: req.body.adminId}
    }).then(data => {
        return res.status(200).json({result: data});
    }).catch(err => {
        return res.status(500).json({error: err.toString(), msg: "SERVER_ERROR"});
    })
}
