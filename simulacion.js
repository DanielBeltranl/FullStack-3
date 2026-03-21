const express = require('express');
const router = require('./src/routes/routes');
require('./src/broker/eventHandler');
const app = express();
app.use(express.json());

app.use('/tickets', router);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});