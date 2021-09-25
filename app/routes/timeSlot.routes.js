const {authJwt} = require("../middleware");
const controller = require("../controllers/timeSlot.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/time-slot/get-by-center",
        controller.getTimeSlotsByCenter
    );

    app.all(
        "/time-slot/get-by-id",
        [authJwt.verifyToken],
        controller.getTimeSlotById
    );

    app.all(
        "/time-slot/register",
        [authJwt.verifyToken],
        controller.registerTimeSlots
    );

    app.all(
        "/time-slot/update",
        [authJwt.verifyToken],
        controller.updateTimeSlots
    );

    app.all(
        "/time-slot/delete",
        [authJwt.verifyToken],
        controller.deleteTimeSlot
    );
};
