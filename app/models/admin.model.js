module.exports = (sequelize, Sequelize) => {
    return sequelize.define("admin", {
        adminID: {
            type: Sequelize.STRING(50)
        },
        name: {
            type: Sequelize.STRING(100)
        },
        role: {
            type: Sequelize.INTEGER(4) // 1-super admin, 2-common admin
        },
        phone: {
            type: Sequelize.STRING(16)
        },
        email: {
            type: Sequelize.STRING(50)
        },
        password: {
            type: Sequelize.STRING(256)
        },
        testCenterId: {
            type: Sequelize.INTEGER(11)
        },
        active: {
            type: Sequelize.INTEGER(4),
            defaultValue: 1,
        },
        updatedDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        createdDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        }
    }, {
        timestamps: false,
        underscored: false,
    });
};
