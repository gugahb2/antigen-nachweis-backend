module.exports = (sequelize, Sequelize) => {
    return sequelize.define("testCenter", {
        name: {
            type: Sequelize.STRING(100)
        },
        address: {
            type: Sequelize.STRING(100)
        },
        latitude: {
            type: Sequelize.DOUBLE
        },
        longitude: {
            type: Sequelize.DOUBLE
        },
        stamp: {
            type: Sequelize.STRING(255)
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
