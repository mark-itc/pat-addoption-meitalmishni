module.exports = class UsersDAO {

    static dbConnection;

    static InjectConnection(connection) {

        if (!connection) return;

        UsersDAO.dbConnection = connection;
    }

    static async CreateUser(userObject) {

        const { email, password, firstName, lastName, phone } = userObject;

        const [result] = await UsersDAO.dbConnection.query(`insert into users (email, password, first_name, last_name, phone, role)
        value
        (?, ?, ?, ?, ?, ?)`, [email, password, firstName, lastName, phone, 0]);

        if (result.insertId) {
            return result.insertId;
        }

        return false;
    }

    static async GetUserByEmail(email) {

        const [row] = await UsersDAO.dbConnection.query(`select * from users where email=?`, [email])

        return row[0];
    }

    static async GetUserById(id) {

        const [row] = await UsersDAO.dbConnection.query(`select * from users where id=?`, [id])

        return row[0];
    }

    static async UpdateUser(id, userObject) {

        const { email, password, firstName, lastName, phone, bio } = userObject;

        const [row] = await UsersDAO.dbConnection.query(`update users set email=?, password=?, first_name=?, last_name=?,phone=?, bio=? where id=?`, [email, password, firstName, lastName, phone, bio, id])

        return row;
    }

    static async GetUsers() {
        const [row] = await UsersDAO.dbConnection.query(`select * from users`);

        return row;
    }

    static async GetFullUserPetsDataById(id) {
        const [row] = await UsersDAO.dbConnection.query(`select user_id, pet_id as id, type, name,adoption_status, picture, height, weight, color, itc.pets.bio, hypoallergenic, dietary_restrictions,breed
        from itc.users join itc.users_pets on users.id=users_pets.user_id join itc.pets on pets.id=users_pets.pet_id where users.id=?`, [id])

        return row;
    }

    static async GetFullUserSavedPetsDataById(id) {
        const [row] = await UsersDAO.dbConnection.query(`select user_id, pet_id as id, type, name,adoption_status, picture, height, weight, color, itc.pets.bio, hypoallergenic, dietary_restrictions,breed
        from itc.users join itc.saved_pets on users.id=saved_pets.user_id join itc.pets on pets.id=saved_pets.pet_id where users.id=?`, [id])

        return row;
    }
}
