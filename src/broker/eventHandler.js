const {broker} = require('./broker');
const dbTickets = require('../db/database');

broker.on('ticket_creado', async (ticket) => {
    console.log(`[Broker] Procesando ticket #${ticket.id} para ${ticket.usuario}...`);

    await new Promise(resolve => setTimeout(resolve, 7000)); 

    const ticketEnDb = dbTickets.get(ticket.id);
    if (ticketEnDb) {
        ticketEnDb.estado = "Asignado a Técnico";
        ticketEnDb.actualizadoEn = new Date().toISOString();
        console.log(`[Broker] Ticket #${ticket.id} actualizado en DB.`);

        try {
            const respuesta = await fetch(`http://localhost:3000/tickets/${ticket.id}`);
            const data = await respuesta.json();
            
            console.log("----------------------------\n");
            console.log(data);
            console.log("----------------------------\n");
        } catch (error) {
            console.log("[Broker] Error al auto-consultar:", error.message);
        }
    }
});