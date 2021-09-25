const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateRegisterInput(data) {
	let msg = [];

	if(Validator.isEmpty(data.firstName)) {
		msg.push("REQUIRED_FIRSTNAME");
	} else if (Validator.isEmpty(data.lastName)) {
		msg.push("REQUIRED_LASTNAME");
	} else if (Validator.isEmpty(data.email)) {
		msg.push("REQUIRED_EMAIL");
	} else if (Validator.isEmpty(data.phoneNumber)) {
		msg.push("REQUIRED_PHONE");
	} else if (Validator.isEmpty(data.gender)) {
		msg.push("REQUIRED_GENDER");
	} else if (Validator.isEmpty(data.birthDay)) {
		msg.push("REQUIRED_BIRTHDAY");
	} else if (Validator.isEmpty(data.address)) {
		msg.push("REQUIRED_ADDRESS");
	} else if (Validator.isEmpty(data.bookingDate)) {
		msg.push("REQUIRED_BOOKING_DATE");
	}

	return {
		msg: msg,
		isValid: msg.length === 0,
	};
};
