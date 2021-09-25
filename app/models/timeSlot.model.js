module.exports = (sequelize, Sequelize) => {
    return sequelize.define("timeSlot", {
        dateSlotId: {
            type: Sequelize.INTEGER(11)
        },
        startTime: {
            type: Sequelize.STRING(10)
        },
        endTime: {
            type: Sequelize.STRING(10)
        },
        testDuration: {
            type: Sequelize.INTEGER(4)
        },
        checkinInterval: {
            type: Sequelize.INTEGER(4)
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
