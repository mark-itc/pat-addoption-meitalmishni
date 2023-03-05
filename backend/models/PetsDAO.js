module.exports = class PetsDAO {

    static dbConnection;

    static InjectConnection(connection) {

        if (!connection) return;

        PetsDAO.dbConnection = connection;
    }

    static async CreatePet(petObject) {

        const { type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, picture } = petObject;

        const [result] = await PetsDAO.dbConnection.query(`insert into pets (type, name, adoption_status, height, weight, color, bio, dietary_restrictions, breed, hypoallergenic, picture)
        value
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, picture]);

        if (result.insertId) {
            return result.insertId;
        }

        return false;
    }

    static async UpdatePetObject(id, petObject) {

        const { type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, picture } = petObject;

        let result;

        if (picture) {
            [result] = await PetsDAO.dbConnection.query(`update pets set type=?, name=?, adoption_status=?, height=?, weight=?, color=?, bio=?, dietary_restrictions=?, breed=?, hypoallergenic=?, picture=?
            where id=?`, [type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, picture, id]);
        }
        else {
            [result] = await PetsDAO.dbConnection.query(`update pets set type=?, name=?, adoption_status=?, height=?, weight=?, color=?, bio=?, dietary_restrictions=?, breed=?, hypoallergenic=?
            where id=?`, [type, name, adoptionStatus, height, weight, color, bio, dietaryRestrictions, breed, hypoallergenic, id]);
        }

        return result[0];

    }

    static async EditPet(editField, id) {

        const [row] = await PetsDAO.dbConnection.query(`update pets set name=? where id=?`, [editField, id])

        return row;
    }

    static async SetAdoption(petId, status) {
        const [row] = await PetsDAO.dbConnection.query(`update pets set adoption_status=? where id=?`, [status, petId])

        return row;
    }

    static async GetPetById(id) {

        const [row] = await PetsDAO.dbConnection.query(`select * from pets where id=?`, [id])

        return row;
    }

    static async GetPets(queryObject) {

        let sql = "select * from pets WHERE 1=1";

        Object.entries(queryObject).map(
            (entri) => {
                if (entri[1] != '') {
                    return (sql = `${sql} AND ${entri[0]} in ('${entri[1]}')`);

                }
                return sql = sql;
            }
        );

        const [row] = await PetsDAO.dbConnection.query(sql);

        return row;
    }

    static async GetPetById(id) {
        const [row] = await PetsDAO.dbConnection.query(`select * from pets where id=?`, [id])

        return row[0];
    }

    static async UpdatePetStatus(id, status) {
        const [row] = await PetsDAO.dbConnection.query(`update pets set adoption_status=? where id=?`, [status, id])

        return row[0];
    }
}
