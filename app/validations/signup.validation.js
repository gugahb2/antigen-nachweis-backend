const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateSignupInput(data) {
    let msg = "";

    try {
        if (Validator.isEmpty(data.adminID)) {
            msg = "ADMIN_ID_REQUIRED";
        } else if (Validator.isEmpty(data.password)) {
            msg = "PASSWORD_REQUIRED";
        } else if (Validator.isEmpty(data.confirmPassword)) {
            msg = "CONFIRM_PASSWORD_REQUIRED";
        } else if (!Validator.isLength(data.password, {min: 8, max: 30})) {
            msg = "PASSWORD_MIN_LENGTH";
        } else if (!Validator.equals(data.password, data.confirmPassword)) {
            msg = "PASSWORD_NOT_MATCH";
        } else if (Validator.isEmpty(data.email)) {
            msg = "EMAIL_REQUIRED";
        } else if (Validator.isEmpty(data.phone)) {
            msg = "REQUIRED_PHONE";
        }

        return {
            msg: msg,
            isValid: msg === "",
        };
    } catch (e) {
        console.log(e)
        return e;
    }
};
