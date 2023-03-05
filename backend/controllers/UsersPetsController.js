const UsersPetsDAO = require('../models/UsersPetsDAO');

module.exports = class UsersController {

    static async GetUserPets(req, res) {

        console.log("GetUserPets controller");

        try {
            const userId = req.params.id;
            console.log("userId", userId);

            const pets = await UsersPetsDAO.GetPetsByUserId(userId);

            // if (!pets) {
            //     return res.status(400).json({
            //         success: false,
            //         message: 'Wrong data'
            //     })
            // }

            return res.status(200).json({
                pets: pets
            });

        }
        catch (e) {
            console.log(`Error in PetsController.GetUserPets ${e}`);
            return res.status(500).json({
                success: false,
                message: 'unknown error'
            });
        }
    }
}


