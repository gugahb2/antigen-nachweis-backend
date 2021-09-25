const {authJwt} = require("../middleware");
const controller = require("../controllers/testCenter.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/test-center/register",
        [authJwt.verifyToken],
        controller.registerTestCenter
    );

    app.all(
        "/test-center/get-all",
        controller.getAllTestCenter
    );

    app.all(
        "/test-center/get-by-filter",
        [authJwt.verifyToken],
        controller.getTestCenterByFilter
    );

    app.all(
        "/test-center/get-by-id",
        controller.getTestCenterById
    );

    app.all(
        "/test-center/update",
        [authJwt.verifyToken],
        controller.updateTestCenter
    );

    app.all(
        "/test-center/delete",
        [authJwt.verifyToken],
        controller.deleteTestCenter
    );
};
