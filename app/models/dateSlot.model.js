module.exports = (sequelize, Sequelize) => {
    return sequelize.define("dateSlot", {
        testCenterId: {
            type: Sequelize.INTEGER(11)
        },
        weekdays: {
            type: Sequelize.STRING(100)
        },
        capacity: {
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
