module.exports = (sequelize, Sequelize) => {
    return sequelize.define("track", {
        applicationId: {
            type: Sequelize.INTEGER(11)
        },
        customerName: {
            type: Sequelize.STRING(100)
        },
        changeDate: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW
        },
        changeType: {
            type: Sequelize.STRING(10) // add | update
        },
        changeContent: {
            type: Sequelize.STRING(1000)
        },
        adminID: {
            type: Sequelize.STRING(50)
        },
    }, {
        timestamps: false,
        underscored: false,
    });
};
