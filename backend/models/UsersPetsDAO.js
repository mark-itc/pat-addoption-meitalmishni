const PetsDAO = require('../models/PetsDAO');

module.exports = class UsersPetsDAO {

    static dbConnection;

    static InjectConnection(connection) {

        if (!connection) return;

        UsersPetsDAO.dbConnection = connection;
    }

    static async GetPetsByUserId(id) {
        const [petsId] = await UsersPetsDAO.dbConnection.query(`select pet_id from users_pets where user_id=?`, [id])
        //console.log("petsId", petsId);

        let petIdArray = petsId.map(item => item.pet_id);
        //console.log("petIdArray", petIdArray)

        if (petIdArray.length == 0) {
            petIdArray = [0];
        }

        const [row] = await PetsDAO.dbConnection.query(`select * from pets where id in (?)`, [petIdArray]);
        //console.log("row", row);

        return row;
    }

    static async GetUserByPetId(id) {

        const [userId] = await UsersPetsDAO.dbConnection.query(`select user_id from users_pets where pet_id=?`, [id])
        return userId[0];
    }

    static async ReturnPet(userId, petId) {
        const [result] = await UsersPetsDAO.dbConnection.query(`delete from users_pets where user_id=? and pet_id=?`, [userId, petId])

        if (!result.insertId) {
            return result.insertId;
        }

        return false;
    }

    static async SetAdoption(userId, petId) {
        const [result] = await UsersPetsDAO.dbConnection.query(`insert into users_pets (user_id,pet_id) values(?,?)`, [userId, petId])

        if (result.insertId) {
            return result.insertId;
        }

        return false;
    }


}
