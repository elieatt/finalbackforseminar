const express = require('express');
const morgan = require("morgan");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const Livestream = require('./api/models/livestream_model');
const setupSocketIO = require('./api/sockets/livestream_socket');

const app = express()


const PORT = process.env.PORT || 3000;

const mongodbURL = `mongodb+srv://seminar:${encodeURIComponent(process.env.MONGOPASS)}@cluster0.xo6opph.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(mongodbURL, { useNewUrlParser: true })
    .then(() => {

        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });

app.use(morgan("dev"));
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
        return res.status(200).json({});
    }
    next();
});

app.get('/ls/messages/:id', async (req, res, next) => {
    try {
        const arr = await Livestream.findById(req.params.id).populate('messages.message');
        const messages = arr.messages;
        res.status(200).json({
            messages: messages
        });


        return;
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: 'error'
        });
    }

});
app.get('/ping',(req,res,next)=>{
    res.status(200).json({message:'pong'});
});


app.use((req, res, next) => {
    const error = new Error();
    error.message = "NOT FOUND";
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    //console.log(error,req);
    res.status(error.status || 500).json({ error: error.message });
})

const server = app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
    setupSocketIO(server);

});
