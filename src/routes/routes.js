const express = require('express');
const router = express.Router();
const { broker } = require('../broker/broker');
const dbTickets = require('../db/database');

router.post('/', (req, res) => {
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

router.get('/:id', (req, res) => {
    const ticketId = parseInt(req.params.id);
    console.log(`Consultando ticket #${ticketId}`);
    
    const ticket = dbTickets.get(ticketId);
    if (!ticket) return res.status(404).json({ error: "Ticket no encontrado" });

    res.json(ticket);
});

module.exports = router;