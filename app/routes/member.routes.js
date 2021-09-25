const {authJwt} = require("../middleware");
const controller = require("../controllers/member.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "authorization, Origin, Content-Type, Accept"
        );
        next();
    });

    app.all(
        "/member/register",
        [authJwt.verifyToken],
        controller.registerMember
    );

    app.all(
        "/member/get-all",
        [authJwt.verifyToken],
        controller.getAllMember
    );

    app.all(
        "/member/get-by-filter",
        [authJwt.verifyToken],
        controller.getMemberByFilter
    );

    app.all(
        "/member/get-by-id",
        [authJwt.verifyToken],
        controller.getMemberById
    );

    app.all(
        "/member/update",
        controller.updateMember
    );

    app.all(
        "/member/delete",
        controller.deleteMember
    );
};
