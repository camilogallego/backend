import restoreRequestsModel from "../models/restore-requests.model.js";
import { ERRORS, CustomError } from '../../services/errors/errors.js';
import { Logger } from '../../helpers/index.js';


class RestorePaswordRequestManager {

    createRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return await restoreRequestsModel.create({ user: userId });
        } catch (error) {
            Logger.error(error)
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create restore password request', ERRORS.CREATION_ERROR.code)
        }
    }

    getRestorePasswordRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return (
              (await restoreRequestsModel.findOne({ user: userId })) ?? null
            );
        } catch (error) {
            Logger.error( error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not get restore password request', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
    
    deleteRequest = async userId => {
        if(!userId || userId.toString().length < 1 ) {
            Logger.warning('User id is not valid');
            return null;
        }
        try {
            return (
              (await restoreRequestsModel.deleteOne({ user: userId })) ?? null
            );
        } catch (error) {
            Logger.error( error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','Can not relete request', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }
};

export default RestorePaswordRequestManager;