const {authJwt} = require("../middleware");
const controller = require("../controllers/confirmation.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/confirmation/submit",
        controller.submitConfirmation
    );

    app.all(
        "/confirmation/get-by-filter",
        [authJwt.verifyToken],
        controller.getConfirmationByFilter
    );
};
