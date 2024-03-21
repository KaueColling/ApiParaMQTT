import mqtt from "mqtt";
import express from "express"
import cors from "cors"

const clientId = "client" + Math.random().toString(36).substring(7);
const hostUrl = "mqtt://broker.mqttdashboard.com:1883";
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 5000,
};

const client = mqtt.connect(hostUrl, options);


const estufas = {
    Legumes: {
        Pimentao: {},
        Cenoura: {},
        Abobora: {},
    },
    Verduras: [],
    Frutas: []
}

const mensagens = []

client.on("connect", () => {
    console.log("connected");
    client.subscribe("gourmet", (err) => {
        //subscribes
    });
});

client.on("message", (topic, payload, packet) => {
    let messageJSON = payload.toString();
    let message = JSON.parse(messageJSON);
    mensagens.push(message);
});

const app = express()
app.use(express.json())
app.use(cors())

app.get('/mensagens', function(request, response) {
    response.json(mensagens)
})

app.get('/', function(request, response) {
    response.json("Api para mqtt")
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Running")
})
