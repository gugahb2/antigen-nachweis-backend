const {authJwt} = require("../middleware");
const controller = require("../controllers/application.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/application/register",
        controller.registerApplication
    );

    app.all(
        "/application/get-by-filter",
        controller.getApplicationsByFilter
    );

    app.all(
        "/application/get-history",
        [authJwt.verifyToken],
        controller.getApplicationHistory
    );

    app.all(
        "/application/get-by-id",
        controller.getApplicationById
    );

    app.all(
        "/application/update",
        [authJwt.verifyToken],
        controller.updateApplication
    );

    app.all(
        "/application/complete",
        [authJwt.verifyToken],
        controller.completeApplication
    );

    app.all(
        "/application/tested",
        [authJwt.verifyToken],
        controller.finishApplicantTest
    );
};
