const http = require('http');

class Validador {
    constructor(siguiente = null) {
        this.siguiente = siguiente;
    }
    manejar(payload, res) {
        if (this.siguiente) return this.siguiente.manejar(payload, res);

        // Fin de la cadena: todos pasaron, reenvía al servicio principal
        const data = JSON.stringify(payload);
        const proxyReq = http.request(
            { hostname: process.env.MAIN_HOST || 'localhost', port: 3000, path: '/tickets', method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } },
            (proxyRes) => {
                let body = '';
                proxyRes.on('data', chunk => body += chunk);
                proxyRes.on('end', () => {
                    console.log('[Validacion OK] Info enviada correctamente al servicio principal');
                    res.status(200).json({ mensaje: 'Validación exitosa. Información enviada.', respuesta: JSON.parse(body) });
                });
            }
        );
        proxyReq.on('error', () => res.status(502).json({ error: 'Servicio principal no disponible' }));
        proxyReq.write(data);
        proxyReq.end();
    }
}

class ValidadorEsquema extends Validador {
    manejar(payload, res) {
        if (!Object.prototype.hasOwnProperty.call(payload, 'usuario')) {
            console.log('[Validacion 1] El payload debe tener la forma { "usuario": "..." }');
            return res.status(400).json({ error: '[Validacion 1] El payload debe tener la forma { "usuario": "..." }' });
        }
        console.log('[Validacion 1] Estructura correcta');
        return super.manejar(payload, res);
    }
}

class ValidadorValor extends Validador {
    manejar(payload, res) {
        if (!payload.usuario || payload.usuario.trim().length === 0) {
            console.log('[Validacion 2] El campo "usuario" no puede estar vacío');
            return res.status(400).json({ error: '[Validacion 2] El campo "usuario" no puede estar vacío' });
        }
        console.log('[Validacion 2] El campo "usuario" tiene valor');
        return super.manejar(payload, res);
    }
}

class ValidadorSinNumeros extends Validador {
    manejar(payload, res) {
        if (/\d/.test(payload.usuario)) {
            console.log('[Validacion 3] El campo "usuario" no puede contener números');
            return res.status(400).json({ error: '[Validacion 3] El campo "usuario" no puede contener números' });
        }
        console.log('[Validacion 3] El campo "usuario" no contiene números');
        return super.manejar(payload, res);
    }
}

module.exports = { ValidadorEsquema, ValidadorValor, ValidadorSinNumeros };
