import { v4 as uuidv4 } from "uuid";

export default class TicketDTO {
  constructor(ticket) {
    this.purchase_datetime = ticket.purchase_datetime;
    this.code = uuidv4();
    this.amount = ticket.amount || 0;
    this.purchaser = ticket.purchaser || "";
  }
}


