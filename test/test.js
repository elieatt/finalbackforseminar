console.log(null == null);

/*

const livestream = require("./api/models/livestream_model");

app.get("/hi", async (req, res, next) => {
    try {
        const newliveStream = new livestream({
            _id: new mongoose.Types.ObjectId(),
            title: "hi",
            description: "data.description",
            broadcaster: 12313,
            subjectID: "54646545131",
        });
        // await newliveStream.addViewer({ id: "2" });
        const nls = await newliveStream.save();
        console.log(nls);
        res.status(200).json({ ls: nls });
        //return;
    } catch (e) {
        console.log("hi");
        console.log(e);
    }
});
app.get("/bye", async (req, res, next) => {
    try {
        const lss = await livestream.find();
        console.log(lss);
        res.status(200).json({ lss: lss });
    } catch (e) {
        console.log("bye");
        console.log(e);
    }
});
app.get("/modify/:id", async (req, res, next) => {
    const ls = await livestream.findById("64cee1b56ef93423aba21520");
    ls.addViewer({ id: req.params.id });
    console.log(ls);
    res.status(200).json({ ls: ls });
    return;
});
app.get("/delete/:id", async (req, res, next) => {
    const ls = await livestream.findById("64cee1b56ef93423aba21520");
    await ls.removeViewer({ id: req.params.id });
    res.status(200).json({ ls: ls });
});

app.get("/messages/add/:id", async (req, res, next) => {
    try {
        const ls = await livestream.findById(req.params.id);
        const newMessage = {
            senderId: "3",
            messageBody: "hii I am a user", senderName: "Abdo",
        };
        await ls.addMessage(newMessage);
        res.status(200).json({ yes: "yes" });
        return;

    } catch (e) {
        console.log(e);
        res.status(500).json();
    }
});

app.get('/messages/:id', async (req, res, next) => {
    try {
        const arr = await livestream.findById(req.params.id).populate('messages.message');
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
app.get("/deletels/:id", async (req, res, next) => {
    try {
        await livestream.findByIdAndDelete(req.params.id);
        res.status(201).json({ yes: "yes" });
        return;
    } catch (e) {
        console.log(e);
        res.status(500);
    }
});

*/
let a=null;
if((a != null && a!= "0")){
    console.log('hi');
}