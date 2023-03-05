module.exports = class SavedPetsDAO {

    static dbConnection;

    static InjectConnection(connection) {

        if (!connection) return;

        SavedPetsDAO.dbConnection = connection;
    }

    static async SavePet(userId, petId) {
        const [saved] = await SavedPetsDAO.dbConnection.query(`insert into saved_pets (user_id, pet_id) values (?,?)`, [userId, petId])

        if (saved.insertId) {
            return saved.insertId;
        }

        return false;
    }

    static async DeleteSavePet(userId, petId) {
        const [deleted] = await SavedPetsDAO.dbConnection.query(`delete from saved_pets where user_id=? and pet_id=?`, [userId, petId])

        return deleted;
    }

    static async GetSavedById(petId) {
        const [saved] = await SavedPetsDAO.dbConnection.query(`select user_id from saved_pets where pet_id=?`, [petId])

        return saved[0];
    }


}