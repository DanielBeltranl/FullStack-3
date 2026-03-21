const express = require('express');
const { ValidadorEsquema, ValidadorValor, ValidadorSinNumeros } = require('./validadores');

const app = express();
app.use(express.json());

const cadenaValidacion = new ValidadorEsquema(new ValidadorValor(new ValidadorSinNumeros()));

app.post('/validar', (req, res) => cadenaValidacion.manejar(req.body, res));

app.listen(3001, () => console.log('Validador corriendo en http://localhost:3001'));
