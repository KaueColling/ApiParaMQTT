import mqtt from "mqtt";
import express from "express"
import cors from "cors"


const estufas = {
    legumes: [
        "pimentao",
        "cenoura",
        "abobora",
    ],
    verduras: [],
    frutas: []
}
const subscribes = []
Object.keys(estufas).forEach(parent => {
    estufas[parent].map(((index) => {
        subscribes.push(parent + "/" + index)
    }))
});

const clientId = "horta-restaurante-gourmet" + Math.random().toString(36).substring(7);
const hostUrl = "broker.mqttdashboard.com";
const options = {
    keepalive: 60,
    clientId: clientId,
    protocolId: "MQTT",
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 5000,
};

const topics = {}

function bindTopic(topic) {
    if (topics[topic] == undefined) {
        app.get("/" + topic, function (request, response) {
            response.json(topics[topic])
        })
        console.log("binded: " + topic)


        client.subscribe(topic, (err, granted) => {
            if (granted.topic == undefined) {
                topics[topic] = granted
            }
        });
    }
}

const client = mqtt.connect(hostUrl, options);
client.on("connect", () => {
    console.log("connected");
    subscribes.map((topic) => {
        bindTopic(topic)
    })
});


client.on("message", (topic, payload, packet) => {
    let messageJSON = payload.toString();
    let message = JSON.parse(messageJSON);
    bindTopic(topic)
    topics[topic] = message
    console.log(topics[topic])
});


const app = express()
app.use(express.json())
app.use(cors())


app.get('/', function (request, response) {
    response.json("Api para mqtt")
})


const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log("Running")
})
