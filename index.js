const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

let servidores = {};
let logs = []; 

// Limpieza inteligente: Revisa cada segundo y borra solo los que ya cumplieron 10 segundos
setInterval(() => {
    const ahora = Date.now();
    logs = logs.filter(log => log.expira > ahora);
}, 1000);

app.get('/', (req, res) => {
    res.status(200).send('API Online');
});

app.post('/update', (req, res) => {
    const { Brainrot, Dinero, JobId, Players } = req.body;
    if (!JobId) return res.status(400).json({ error: "No JobId" });

    servidores[JobId] = {
        JobId: JobId,
        Brainrot: Brainrot || 0,
        Dinero: Dinero || 0,
        Players: Players || 0
    };
    res.json({ status: "success" });
});

app.post('/send_log', (req, res) => {
    const { JobId, Evento, Usuario } = req.body;
    
    // 1. Filtramos para eliminar cualquier log viejo que tenga este mismo JobId (Adiós repetidos)
    logs = logs.filter(log => log.jobId !== JobId);

    // 2. Guardamos el log nuevo con un contador de vida de 10 segundos (10,000 milisegundos)
    logs.push({
        jobId: JobId || "Global",
        evento: Evento || "N/A",
        usuario: Usuario || "System",
        expira: Date.now() + 10000 
    });

    res.json({ status: "ok" });
});

app.get('/get_logs', (req, res) => {
    // Mapeamos los datos para enviártelos limpios, sin mostrar la variable "expira"
    const logsLimpios = logs.map(l => ({
        JobId: l.jobId,
        Evento: l.evento,
        Usuario: l.usuario
    }));
    res.json(logsLimpios);
});

app.get('/get_server/:jobid', (req, res) => {
    const data = servidores[req.params.jobid];
    if (data) return res.json(data);
    res.status(404).json({ error: "Not found" });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor activo en puerto: ${PORT}`);
});
