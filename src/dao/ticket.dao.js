import TicketModel from "../models/ticket.model.js";

class TicketDAO {
    async createTicket(data) {
        return await TicketModel.create(data);
    }
}

export default new TicketDAO();
