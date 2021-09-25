module.exports = (sequelize, Sequelize) => {
    return sequelize.define("confirmation", {
        bookingID: {
            type: Sequelize.INTEGER(21)
        },
        testDate: {
            type: Sequelize.DATE,
        },
        testCenterId: {
            type: Sequelize.INTEGER(255),
        },
        tickbox1: {
            type: Sequelize.INTEGER(4),
            defaultValue: 0,
        },
        tickbox2: {
            type: Sequelize.INTEGER(4),
            defaultValue: 0,
        },
        tickbox3: {
            type: Sequelize.INTEGER(4),
            defaultValue: 0,
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
