const controller = require("../controllers/auth.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/auth/admin/login",
        controller.adminLogin
    );

    app.all(
        "/auth/admin/sign-up",
        controller.adminSignUp
    );

    app.all(
        "/auth/admin/register",
        controller.registerAdmin
    );

    app.all(
        "/auth/admin/get",
        controller.getAdminById
    );
};
