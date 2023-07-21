import ticketModel  from "../models/ticket.model.js";
import { ERRORS, CustomError } from '../../services/errors/errors.js';
import { Logger } from '../../helpers/index.js';


class TicketManager {

    createTicket = async (ticket) => {
        if(!ticket.code || ticket.code.length < 8 || !ticket.purchase_datetime || !ticket.amount || ticket.amount <= 0 || !ticket.purchaser || ticket.purchaser.length < 5 ) {
            Logger.warning('Ticket can not be created without all the fields');
            return null;
        }
        try {
            return await ticketModel.create(ticket);
        } catch (error) {
            Logger.error(error)
            CustomError.createError(ERRORS.CREATION_ERROR.name,'','Can not create ticket', ERRORS.CREATION_ERROR.code)
        }
    }

    getTicket = async (query = {}) => {
        try {
            const ticket = (await ticketModel.findOne(query)) ?? null;
            return ticket
        } catch (error) {
            Logger.error(error)
            CustomError.createError(ERRORS.INVALID_PARAMETER_ERROR.name,'','can not get ticket with provided query', ERRORS.INVALID_PARAMETER_ERROR.code)
        }
    }


};

export default TicketManager;