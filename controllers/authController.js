const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const {Op} = require('sequelize')
const nodemailer = require('nodemailer')
const constants = require('../utils/constants')

const User = require('../models').users
const Email = require('../models').emails
const CarWashPoint = require('../models').carWashPoint
const CarWashDevice = require('../models').carWashDevice
const DeviceSettings = require('../models').deviceSettings
const Counter = require('../models').counters

const signIn = async (req, res) => {
    try {
        const {username, password} = req.body;

        let candidate = await User.findOne({where: {username}});
        if (!candidate) return res.send({
            success: false,
            msg: "Invalid username/password"
        });

        const areSame = await bcrypt.compare(password, candidate.password);
        if (!areSame) return res.send({
            success: false,
            msg: "Invalid username/password"
        });

        const token = jwt.sign(
            {id: candidate.id, role: candidate.role},
            process.env.JWT_SECRET,
            {
                expiresIn: 86400
            }
        );

        candidate.set({token})

        // const timeOut = 3600 * 24;

        // setTimeout(async () => {
        //     candidate.set({token: null})
        //     await candidate.save();
        // }, timeOut)
        await candidate.save()

        return res.send({success: true, token, msg: "Login successful"})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getAuth = async (req, res) => {
    try {
        let isUserIncludes = [
            {
                model: DeviceSettings,
            },
        ];

        if (req.user.role === constants.userTypes.USER) {
            isUserIncludes.push({
                model: Counter
            })
        }

        let carWashAssociation = []

        if (req.user.role === constants.userTypes.USER) {
            carWashAssociation = [
                {
                    model: CarWashPoint,
                    as: 'user_points',
                    include: [
                        {
                            model: CarWashDevice,
                            include: isUserIncludes ? isUserIncludes : []
                        }
                    ]
                }
            ]
        } else if (req.user.role === constants.userTypes.TECHNICIAN) {
            carWashAssociation = [
                {
                    model: CarWashPoint,
                    as: 'technician_points',
                    include: [
                        {
                            model: CarWashDevice,
                            include: isUserIncludes ? isUserIncludes : []
                        }
                    ]
                }
            ]
        } else {
            carWashAssociation = []
        }

        const candidate = await User.findByPk(req.user.id, {
            attributes: ['id', 'username', 'role', 'email'],
            include: carWashAssociation.length ? carWashAssociation : []
        })

        return res.send(candidate)
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const logout = async (req, res) => {
    try {
        const candidate = await User.findByPk(req.user.id);
        candidate.set({token: null})
        await candidate.save();
        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong')
    }
}

const addEmail = async (req, res) => {
    try {
        const {email} = req.body;
        const candidate = await User.findByPk(req.user.id)

        if (!candidate) return res.send({success: false})

        candidate.set({email})
        await candidate.save()

        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong')
    }
}

const changePassword = async (req, res) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const candidate = await User.findByPk(req.user.id)

        const areSame = await bcrypt.compare(oldPassword, candidate.password);
        if (!areSame) return res.send({success: false, msg: 'invalid password'})

        const hashPassword = await bcrypt.hash(newPassword, 10)

        candidate.set({password: hashPassword})
        await candidate.save()

        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong')
    }
}

const forgotPasswordSendEmail = async (req, res) => {
    try {
        const {email} = req.body;

        const randomNumber = Math.floor(
            Math.pow(10, 5) + Math.random() * 5 * Math.pow(10, 5)
        );

        const candidate = await User.findOne({where: {email}})
        if (!candidate) return res.send({msg: 'user not found'})

        await nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: 'login',
                user: "vaheemkrtchyan@gmail.com",
                // user: process.env.NODEMAILER_EMAIL,
                pass: process.env.NODEMAILER_PASSWORD
            },
            secure: true,
        }).sendMail({
                from: process.env.NODEMAILER_EMAIL,
                to: email,
                subject: `Forgot password`,
                text: `Your activated code is < ${randomNumber} >`,
                // html: "<b>Hello world?</b>",
            }
            , async function (error, info) {
                if (error) {
                    res.send({success: false, error, info})
                } else {
                    await Email.create(({user_id: candidate.id, code: randomNumber}))
                    return res.send({success: true})
                }
            })
    } catch (e) {
        console.log('something went wrong')
    }
}

const confirmTheCodeSentByEmail = async (req, res) => {
    try {
        const {code} = req.body;

        const isValid = await Email.findOne({where: {code}})
        if (!isValid) return res.send({success: false, msg: 'invalid code'})

        return res.send({success: true, code})
    } catch (e) {
        console.log('something went wrong')
    }
}

const forgotPassword = async (req, res) => {
    try {
        const {code, newPassword} = req.body;

        const isValid = await Email.findOne({where: {code}})
        if (!isValid) return res.send({success: false, msg: 'invalid code'})

        const hashPassword = await bcrypt.hash(newPassword, 10)

        const candidate = await User.findByPk(isValid.user_id)

        if (!candidate) return res.send({success: false, msg: 'user not found'})
        candidate.set({password: hashPassword})

        await candidate.save()
        await isValid.destroy();

        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const registerTechnician = async (req, res) => {
    try {
        const {username, password} = req.body;

        const candidate = await User.findOne({where: {username}});
        if (candidate) return res.send({
            success: false,
            msg: `${constants.userTypes.TECHNICIAN} exist`
        });

        const hashPassword = await bcrypt.hash(password, 10);

        User.create({
            username,
            password: hashPassword,
            role: constants.userTypes.TECHNICIAN,
            active: true,
        })
            .then((data) => {
                res.send({success: true});
            })
            .catch((e) => {
                res.send({success: false, msg: e});
            });
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const registerUser = async (req, res) => {
    try {
        const {username, password} = req.body;

        const candidate = await User.findOne({where: {username}});
        if (candidate) return res.send({
            success: false,
            msg: `${constants.userTypes.USER} exist`
        });

        const hashPassword = await bcrypt.hash(password, 10);

        User.create({
            username,
            password: hashPassword,
            role: constants.userTypes.USER,
            active: true,
        })
            .then((data) => {
                res.send({success: true});
            })
            .catch((e) => {
                res.send({success: false, msg: e});
            });
    } catch (e) {
        res.send({msg: 'error', error: e})
    }
}

const deactivateTechnicianAccount = async (req, res) => {
    try {
        const {id} = req.body;
        const candidate = await User.findOne({
            where: {
                id,
                role: constants.userTypes.TECHNICIAN
            }
        })
        if (!candidate) return res.send({success: false, msg: `${constants.userTypes.TECHNICIAN} not found`})

        candidate.set({active: false});
        await candidate.save()
        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const activateTechnicianAccount = async (req, res) => {
    try {
        const {id} = req.body;
        const candidate = await User.findOne({
            where: {
                id,
                role: constants.userTypes.TECHNICIAN
            }
        })
        if (!candidate) return res.send({success: false, msg: `${constants.userTypes.TECHNICIAN} not found`})

        candidate.set({active: true});
        await candidate.save()
        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const deactivateUserAccount = async (req, res) => {
    try {
        const {id} = req.body;
        const candidate = await User.findOne({
            where: {
                id,
                role: constants.userTypes.USER
            }
        })
        if (!candidate) return res.send({success: false, msg: `${constants.userTypes.USER} not found`})

        candidate.set({active: false});
        await candidate.save()
        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const activateUserAccount = async (req, res) => {
    try {
        const {id} = req.body;
        const candidate = await User.findOne({
            where: {
                id,
                role: constants.userTypes.USER
            }
        })
        if (!candidate) return res.send({success: false, msg: `${constants.userTypes.USER} not found`})

        candidate.set({active: true});
        await candidate.save()
        return res.send({success: true})
    } catch (e) {
        console.log('something went wrong', e)
    }
}

const getUsers = async (req, res) => {
    try {
        const {role, id} = req.user

        let users;

        if (role === constants.userTypes.USER) return res.status(403).json({success: false})

        if (role === constants.userTypes.TECHNICIAN) {
            let idOfUsersFromTechnician = []

            let carWashPoints = await CarWashPoint.findAll({
                where: {technician_id: id}
            })
            carWashPoints.forEach(point => idOfUsersFromTechnician.push(point.user_id))

            users = await User.findAll({
                attributes: {exclude: ['password', 'token', 'updatedAt']},
                order: [["id", "DESC"]],
                where: {
                    id: idOfUsersFromTechnician,
                    [Op.not]: [{id}]
                },
            })
        } else if (role === constants.userTypes.ADMIN) {
            users = await User.findAll({
                attributes: {exclude: ['password', 'token', 'updatedAt']},
                order: [["id", "DESC"]],
                where: {
                    [Op.not]: [{id}]
                }
            })
        }

        return res.send({users})
    } catch (e) {
        console.log('something went wrong', e)
    }
}


module.exports = {
    signIn,
    registerTechnician,
    registerUser,
    activateTechnicianAccount,
    deactivateTechnicianAccount,
    activateUserAccount,
    deactivateUserAccount,
    getAuth,
    logout,
    addEmail,
    changePassword,
    forgotPasswordSendEmail,
    confirmTheCodeSentByEmail,
    forgotPassword,
    getUsers
}