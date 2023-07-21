import { findOne, findById, create } from "../models/reset-requests.model";
import { ERRORS, CustomError } from '../../services/errors/errors';
import { Logger } from '../../helpers';


class UserManager {

    getUser = async (email = '') => {
        if (!email || typeof (email) !== "string" || email.length < 5) {
            throw Error("El email ingresado es incorrecto");
        }
        try {
            return await findOne({ email }).populate('cart');
        } catch (error) {
            Logger.error(error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided email ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
    getUserById = async (id = '') => {
        if (!id || typeof (id) !== "string" || id.length < 5) {
            throw Error("El id ingresado es incorrecto");
        }
        try {
            return await findById(id).populate('cart');
        } catch (error) {
            Logger.error(error);
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get user with the provided id ', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }

    addUser = async ({email, first_name, last_name, age, password, address, cart, role = 'user'}) => {
        try {
            return await create({email, password, first_name, last_name, age, password, address, cart, role});
        } catch (error) {
            Logger.error(error);

            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create new user', ERRORS.CREATION_ERROR.code)
        }
    }


};

export default UserManager;