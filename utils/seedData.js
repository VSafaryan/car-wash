const constants = require('../utils/constants')

const users = [
    {
        username: 'admin',
        password: '$2a$10$wNwggIDxVkR8ty4OnWO01ukJqfdzqTSdaOCIye8pGGXJGStyXeIqm',
        email: "vlo.galstyan.2013@mail.ru",
        role: constants.userTypes.ADMIN,
        token: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        username: 'user',
        password: '$2a$10$wNwggIDxVkR8ty4OnWO01ukJqfdzqTSdaOCIye8pGGXJGStyXeIqm',
        email: null,
        role: constants.userTypes.USER,
        token: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        username: 'technician',
        password: '$2a$10$wNwggIDxVkR8ty4OnWO01ukJqfdzqTSdaOCIye8pGGXJGStyXeIqm',
        role: constants.userTypes.TECHNICIAN,
        email: null,
        token: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        username: 'user_2',
        password: '$2a$10$wNwggIDxVkR8ty4OnWO01ukJqfdzqTSdaOCIye8pGGXJGStyXeIqm',
        role: constants.userTypes.USER,
        email: null,
        token: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
]

const carWashPoints = [
    {
        user_id: 2,
        technician_id: 3,
        car_wash_point_name: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        user_id: 2,
        technician_id: 3,
        car_wash_point_name: 'car wash 2',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        user_id: 4,
        technician_id: 3,
        car_wash_point_name: null,
        createdAt: new Date(),
        updatedAt: new Date()
    },
]

const carWashDevices = [
    {
        technician_id: 3,
        car_wash_point_id: 1,
        name: 'device_1',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        technician_id: 3,
        car_wash_point_id: 1,
        name: 'device_2',
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        technician_id: 3,
        car_wash_point_id: 2,
        name: 'device_3',
        createdAt: new Date(),
        updatedAt: new Date()
    },
]

const deviceSettings = [
    {
        device_id: 1,
        coinNominal: 100,
        billNominal: 100,
        mode: constants.deviceSettings.mode.Cash,
        bypass: constants.deviceSettings.bypass.Disabled,
        bypassChann: constants.deviceSettings.bypassChann.Disabled,
        bpTime: 100,
        bonusPct: 50,
        bonusVal: 1000,
        tBonusPct: 50,
        tBonusVal: 1000,
        bonusSchStart: "00:00 - 10:00",
        bonusSchEnd: "10:00 - 20:00",
        tariffPct: 50,
        tariffSchStart: "00:00 - 10:00",
        tariffSchEnd: "10:00 - 20:00",
        flowPulse1: 4000,
        flowTimeout1: 5000,
        flowPulse2: 4000,
        flowTimeout2: 5000,
        hpt: constants.deviceSettings.hpt.Enabled,
        service: 2000,
        bingoThr: 10000,
        bingoVal: 20000,
        hopper: constants.deviceSettings.hopper.Enabled,
        hopperNominal: 2500,
        hopperThreshold: 3000,
        language: constants.deviceSettings.language.Armenian,
        currency: constants.deviceSettings.currency.AMD,
        digColor: constants.deviceSettings.digColor.YELLOW,
        channels: 100,
        colors: 4,
        screen: 200,
        devID: 1,
        valveP: 100,
        ValveD: 200,
        ValveC: 300,
        bonusMode: constants.deviceSettings.bonusMode.Always,
        pauseMode: constants.deviceSettings.pauseMode.Unlimited,
        dateTime: "20220429T10:33:23.073Z",
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

const counters = [
    {
        device_id: 1,
        coinT: 0,
        coinD: 0,
        billT: 0,
        billD: 0,
        cashlessT: 0,
        cashlessD: 0,
        bonusT: 0,
        bonusD: 0,
        serviceT: 0,
        serviceD: 0,
        chSpent: "{t: 0, d: 0}",
        chTimePaidMode: "{t: 0, d: 0}",
        chTimeFreeMode: "{t: 0, d: 0}",
        powerOnTime: 0,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

module.exports = {
    users,
    carWashPoints,
    carWashDevices,
    deviceSettings,
    counters
}