const PetsDAO = require('../models/PetsDAO');
const UsersPetsDAO = require('../models/UsersPetsDAO');
const SavedPetsDAO = require('../models/SavedPetsDAO');
const url = require('url');
const AWS = require('aws-sdk');
const base64 = require('base64-js');
const jwt = require('jsonwebtoken');
const { AddNewPetValidation, EditPetValidation } = require('../validations/PetsValidation');


async function UploadFile(pictureBase64, pictureName, pictureType) {

    const imageBinary = base64.toByteArray(pictureBase64);

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'me-central-1'
    })

    const uploadedImage = await s3.upload({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: pictureName,
        Body: imageBinary,
        ContentType: pictureType
    }).promise();

}

function getUserByToken(req) {
    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    return tokenData;
}


module.exports = class PetsController {

    static async SearchPets(req, res) {

        console.log("Find pets");

        //const queryObject = url.parse(req.url, true).query;
        const queryObject = req.params;
        console.log("queryObject", queryObject);

        Object.keys(queryObject).forEach(key => {
            if (queryObject[key] === undefined) {
                delete queryObject[key];
            }
        });

        console.log("queryObject", queryObject);

        try {
            const pets = await PetsDAO.GetPets(queryObject);

            //console.log("pets", pets);

            return res.status(200).json({
                pets: pets
            })

        } catch (e) {
            console.log(`Error in PetsController.SearchPets ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }

    }

    static async GetPet(req, res) {

        try {
            const petId = req.params.id;
            const pet = await PetsDAO.GetPetById(petId);

            if (!pet) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong pet'
                })
            }

            const tokenData = getUserByToken(req);

            const userId = await UsersPetsDAO.GetUserByPetId(petId);
            const savedPet = await SavedPetsDAO.GetSavedById(petId);

            let isUserSavedPet;

            if (savedPet === undefined) {
                isUserSavedPet = false;
            }
            else {
                isUserSavedPet = savedPet.user_id == tokenData.user_id;
            }

            let isUserOwnPet;

            if (userId === undefined) {
                isUserOwnPet = 0;
            }
            else {
                isUserOwnPet = userId.user_id == tokenData.user_id;
            }

            return res.status(200).json({
                pet: pet,
                isUserOwnPet: isUserOwnPet,
                isUserSavedPet: isUserSavedPet,
                petStatus: pet.adoption_status
            });

        }
        catch (e) {
            console.log(`Error in PetsController.GetPet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async ReturnPet(req, res) {

        try {
            console.log("req.params.id", req.params.id);

            const petId = req.params.id;
            const pet = await PetsDAO.GetPetById(petId);

            if (!pet) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong pet'
                })
            }

            const tokenData = getUserByToken(req);
            const userId = tokenData.user_id;

            const returned = await UsersPetsDAO.ReturnPet(userId, petId);
            console.log("returned", returned);

            const updated = await PetsDAO.UpdatePetStatus(petId, 'Available');
            console.log("updated", updated);

            return res.status(200).json({
                success: true
            });

        }
        catch (e) {
            console.log(`Error in PetsController.ReturnPet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async AdoptPet(req, res) {
        try {
            console.log("req.params.id", req.params.id);

            const petId = req.params.id;
            const pet = await PetsDAO.GetPetById(petId);

            if (!pet) {
                return res.status(400).json({
                    success: false,
                    message: 'Wrong pet'
                })
            }

            const tokenData = getUserByToken(req);
            const userId = tokenData.user_id;

            const status = req.body.status;
            console.log("status", status);

            const adoptedPet = await PetsDAO.SetAdoption(petId, status);
            console.log("adoptedPet", adoptedPet);

            const userPetAdoption = await UsersPetsDAO.SetAdoption(userId, petId);
            console.log("userPetAdoption", userPetAdoption);

            return res.status(200).json({
                success: true
            });

        }
        catch (e) {
            console.log(`Error in PetsController.AdoptPet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }


    static async EditPet(req, res) {
        try {
            console.log("body", req.body);
            const petId = req.params.id;
            const validRequest = EditPetValidation(req.body);

            if (!validRequest) {
                const errorMessage = `Input parsing error: ${EditPetValidation.errors[0].instancePath} ${EditPetValidation.errors[0].message}.`;

                return res.status(400).json({
                    success: false,
                    message: errorMessage
                })
            }

            const petObject = {
                type: req.body.type,
                name: req.body.name,
                adoptionStatus: req.body.adoptionStatus,
                height: req.body.height,
                weight: req.body.weight,
                color: req.body.color,
                bio: req.body.bio,
                dietaryRestrictions: req.body.dietaryRestrictions,
                breed: req.body.breed,
                hypoallergenic: req.body.hypoallergenic,
                picture: req.body.pictureName
            }

            const pictureValidExtensions = ['png', 'jpeg', 'jpg'];

            if (req.body.pictureName) {
                if (!pictureValidExtensions.includes(req.body.pictureType.split('/')[1])) {
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid picture type'
                    })
                }

                UploadFile(req.body.pictureBase64, req.body.pictureName, req.body.pictureType);
            }

            const updatedPet = await PetsDAO.UpdatePetObject(petId, petObject);
            console.log("updatedPet", updatedPet);

            return res.status(200).json({
                updatedPet: updatedPet,
            })

        } catch (e) {
            console.log(`Error in PetsController.EditPet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

    static async AddNewPet(req, res) {

        try {
            console.log("body", req.body);

            const validRequest = AddNewPetValidation(req.body);

            if (!validRequest) {
                const errorMessage = `Input parsing error: ${AddNewPetValidation.errors[0].instancePath} ${AddNewPetValidation.errors[0].message}.`;

                return res.status(400).json({
                    success: false,
                    message: errorMessage
                })
            }

            const petObject = {
                type: req.body.type,
                name: req.body.name,
                adoptionStatus: req.body.adoptionStatus,
                height: req.body.height,
                weight: req.body.weight,
                color: req.body.color,
                bio: req.body.bio,
                dietaryRestrictions: req.body.dietaryRestrictions,
                breed: req.body.breed,
                hypoallergenic: req.body.hypoallergenic,
                picture: req.body.pictureName
            }

            const pictureValidExtensions = ['png', 'jpeg', 'jpg'];

            if (!pictureValidExtensions.includes(req.body.pictureType.split('/')[1])) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid picture type'
                })
            }

            const petId = await PetsDAO.CreatePet(petObject);

            UploadFile(req.body.pictureBase64, req.body.pictureName, req.body.pictureType);

            return res.status(200).json({
                petId: petId,
            })

        } catch (e) {
            console.log(`Error in PetsController.AddNewPet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }

}