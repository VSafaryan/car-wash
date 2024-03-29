'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CarWashPoints extends Model {
        static associate(models) {
            // define association here
        }
    }

    CarWashPoints.init({
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        car_wash_point_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        technician_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'CarWashPoints',
    });

    const User = sequelize.define('User')
    CarWashPoints.belongsTo(User, {
        foreignKey: 'id',
    })

    const CarWashDevice = sequelize.define('CarWashDevices')
    CarWashPoints.hasMany(CarWashDevice, {
        foreignKey: 'car_wash_point_id'
    })

    return CarWashPoints;
};