const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateLoginInput(data) {
    let msg = "";

    try {
        if (Validator.isEmpty(data.adminID)) {
            msg = "REQUIRED_ADMIN_ID";
        } else if (Validator.isEmpty(data.password)) {
            msg = "REQUIRED_PASSWORD";
        }

        return {
            msg: msg,
            isValid: msg === ""
        };
    } catch (e) {
        return  e;
    }
};
