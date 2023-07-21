import { TicketService } from "../services/index.js";
import moment from "moment";
import { TicketDTO } from "../dto/index.js";
import { Logger } from "../helpers/index.js";

class TicketController {
  createTicket = async (req, res) => {
    try {
      const { amount } = req.body;
      if (!amount || Number(amount) <= 0) {
        Logger.error("Ticket can not be created without amount");
        return null;
      }
      const purchase_datetime = moment().format("MMMM Do YYYY, h:mm:ss a");
      const purchaser = req.user.email;
      const ticketDTO = new TicketDTO({ purchaser, purchase_datetime, amount });
      const ticket = (await TicketService.createTicket(ticketDTO)) ?? null;
      if (!ticket) {
        return res.status(400).json({
          message: `Ticket not created `,
          ticket: null,
        });
      }

      return res.json({
        message: `Ticket created succesfully`,
        ticket: ticket,
      });
    } catch (error) {
      Logger.error(error);
    }
  };

  getTicket = async (req, res) => {
    try {
      const { email } = req.query;
      const ticket = await TicketService.getTicket({ purchaser: email });
      if (ticket) {
        return res.status(200).json({
          message: `Ticket found Successfully`,
          ticket: ticket,
        });
      }

      return res.status(400).json({
        message: `Ticket not found.`,
        ticket: null,
        ok: false,
      });
    } catch (error) {
      Logger.error(error);
    }
  };
}

export default TicketController;
