const SavedPetsDAO = require('../models/SavedPetsDAO');
const PetsDAO = require('../models/PetsDAO');
const jwt = require('jsonwebtoken');


function getUserByToken(req) {
    let token = req.headers.authorization;
    token = token.replace('Bearer ', '');
    const tokenData = jwt.verify(token, process.env.JWT_KEY);
    return tokenData;
}

module.exports = class SavedPetsController {

    static async SavePet(req, res) {

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
            const userId = tokenData.user_id;

            const saved = await SavedPetsDAO.SavePet(userId, petId);
            console.log("saved", saved);

            return res.status(200).json({
                success: true
            });

        }
        catch (e) {
            console.log(`Error in SavedPetsController.SavePet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }


    static async DeleteSavePet(req, res) {

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
            const userId = tokenData.user_id;

            const deleted = await SavedPetsDAO.DeleteSavePet(userId, petId);
            console.log("deleted", deleted);

            return res.status(200).json({
                success: true
            });

        }
        catch (e) {
            console.log(`Error in SavedPetsController.DeleteSavePet ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }



}