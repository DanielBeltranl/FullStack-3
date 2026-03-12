const express = require('express');
const EventEmitter = require('events');

const app = express();
app.use(express.json());


const broker = new EventEmitter();

const dbTickets = new Map();


broker.on('ticket_creado', async (ticket) => {
    console.log(`[Broker] Procesando ticket #${ticket.id} para el usuario ${ticket.usuario}...`);

    await new Promise(resolve => setTimeout(resolve, 5000)); 
    

    const ticketEnDb = dbTickets.get(ticket.id);
    if (ticketEnDb) {
        ticketEnDb.estado = "Asignado a Técnico";
        ticketEnDb.actualizadoEn = new Date().toISOString();
        console.log(`[Broker] Ticket #${ticket.id} procesado y asignado a un tecnico.`);
    }
});


app.post('/tickets', (req, res) => {
    const { usuario } = req.body;
    
    if (!usuario) return res.status(400).json({ error: "Falta el nombre de usuario" });

    const ticketId = Date.now(); 
    const nuevoTicket = {
        id: ticketId,
        usuario: usuario,
        estado: "Recibido",
        creadoEn: new Date().toISOString()
    };

    dbTickets.set(ticketId, nuevoTicket);

    broker.emit('ticket_creado', nuevoTicket);

    res.status(202).json({
        mensaje: "Ticket registrado correctamente",
        ticketId: ticketId,
        nota: "El procesamiento ha comenzado en segundo plano."
    });
});


app.get('/tickets/:id', (req, res) => {
    const ticketId = parseInt(req.params.id);
    const ticket = dbTickets.get(ticketId);

    if (!ticket) {
        return res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});