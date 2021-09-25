module.exports = (sequelize, Sequelize) => {
    return sequelize.define("application", {
        firstName: {
            type: Sequelize.STRING(50)
        },
        lastName: {
            type: Sequelize.STRING(50)
        },
        email: {
            type: Sequelize.STRING(50)
        },
        phoneNumber: {
            type: Sequelize.STRING(16)
        },
        gender: {
            type: Sequelize.STRING(20)
        },
        birthDay: {
            type: Sequelize.DATE
        },
        IDNumber: {
            type: Sequelize.STRING(30)
        },
        address: {
            type: Sequelize.STRING(100)
        },
        zipcode: {
            type: Sequelize.STRING(20)
        },
        street: {
            type: Sequelize.STRING(100)
        },
        bookingDate: {
            type: Sequelize.DATE,
        },
        timeSlotId: {
            type: Sequelize.INTEGER(11),
        },
        bookingTime: {
            type: Sequelize.STRING(16),
        },
        testCenterId: {
            type: Sequelize.INTEGER(11)
        },
        adminId: {
            type: Sequelize.INTEGER(11)
        },
        status: {
            type: Sequelize.INTEGER(4), //0-unchecked 1-pending, 2-positive, 3-negative, 4-ok_submitted, 5-bad_submitted
            defaultValue: 0,
        },
        completed: {
            type: Sequelize.INTEGER(4),
            defaultValue: 0,
        },
        active: {
            type: Sequelize.INTEGER(4),
            defaultValue: 1,
        },
        checkinDate: {
            type: Sequelize.DATE,
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
