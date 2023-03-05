const sha256 = require('js-sha256');
const jwt = require('jsonwebtoken');
const UsersDAO = require('../models/UsersDAO');
const { RegisterValidation, LoginValidation, UpdateUserWithPasswordValidation, UpdateUserWithoutPasswordValidation } = require('../validations/UsersValidation');

module.exports = class UsersController {

    static async Signup(req, res) {

        try {
            const validRequest = RegisterValidation(req.body);

            if (!validRequest) {
                const errorMessage = `Input parsing error: ${RegisterValidation.errors[0].instancePath} ${RegisterValidation.errors[0].message}.`;

                return res.status(400).json({
                    success: false,
                    message: errorMessage
                })
            }

            const userObject = {
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
            }

            const user = await UsersDAO.GetUserByEmail(userObject.email);

            if (user && user.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: 'This email is already in use'
                })
            }

            userObject.password = sha256(userObject.password);

            const userId = await UsersDAO.CreateUser(userObject);

            const token = jwt.sign({
                user_id: userId,
                email: req.body.email
            }, process.env.JWT_KEY);

            return res.status(200).json({
                token: token,
                userId: userId,
                userRole: 0
            })

        } catch (e) {
            console.log(`Error in UsersController.Register ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async Login(req, res) {

        try {

            const validRequest = LoginValidation(req.body)

            if (!validRequest) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong username or password'
                })
            }

            const user = await UsersDAO.GetUserByEmail(req.body.email);
            const userObject = user;

            if (!user || (userObject.password != sha256(req.body.password))) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong username or password'
                })
            }

            console.log("userObject", userObject)

            const token = jwt.sign({
                user_id: userObject.id,
                email: req.body.email
            }, process.env.JWT_KEY);

            return res.status(200).json({
                token: token,
                userId: userObject.id,
                userRole: userObject.role
            })

        } catch (e) {
            console.log(`Error in UsersController.Login ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async GetUser(req, res) {

        try {
            const queryId = req.params.id;

            const user = await UsersDAO.GetUserById(queryId);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong user'
                })
            }

            return res.status(200).json({
                userObject: user
            });

        }
        catch (e) {
            console.log(`Error in UsersController.GetUser ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async GetUsersList(req, res) {

        try {
            const users = await UsersDAO.GetUsers();
            console.log("users");

            if (!users) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong data'
                })
            }

            return res.status(200).json({
                users: users
            });

        }
        catch (e) {
            console.log(`Error in UsersController.GetUsersList ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }

    }

    static async UpdateUser(req, res) {

        try {
            const queryId = req.params.id;
            const chanedUser = await UsersDAO.GetUserById(queryId);

            if (!chanedUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data'
                })
            }

            const changedUserPassword = chanedUser.password;
            let validRequest;
            let validationSchema;

            if (req.body.password && req.body.password != '') {
                validRequest = UpdateUserWithPasswordValidation(req.body);
                validationSchema = UpdateUserWithPasswordValidation;
            } else {
                req.body.password = changedUserPassword;
                validRequest = UpdateUserWithoutPasswordValidation(req.body);
                validationSchema = UpdateUserWithoutPasswordValidation;
            }

            if (!validRequest) {
                return res.status(400).json({
                    success: false,
                    message: validationSchema.errors[0].message
                })
            }

            const updatedUser = await UsersDAO.UpdateUser(queryId, req.body);

            return res.status(200).json({
                userObject: updatedUser
            });
        }
        catch (e) {
            console.log(`Error in UsersController.updateUserDetails ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async GetFullUser(req, res) {

        try {
            const queryId = req.params.id;
            const user = await UsersDAO.GetUserById(queryId);

            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid data'
                })
            }

            const fullUserPetsData = await UsersDAO.GetFullUserPetsDataById(queryId);
            console.log("fullUserPetsData", fullUserPetsData);

            const fullUserSavedPetsData = await UsersDAO.GetFullUserSavedPetsDataById(queryId);
            console.log("fullUserSavedPetsData", fullUserSavedPetsData);

            return res.status(200).json({
                pets: fullUserPetsData,
                savedPets: fullUserSavedPetsData
            });
        }
        catch (e) {
            console.log(`Error in UsersController.GetFullUser ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }

    }

}
