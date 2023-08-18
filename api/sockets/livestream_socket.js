const socketIO = require('socket.io');
const Livestream = require('../models/livestream_model');
const { getUserData, setLiveStreamId } = require("../../get_user_info");
const mongoose = require('mongoose');



function setupSocketIO(server) {
    const io = socketIO(server);

    const liveStreamIO = io.of('/live');

    liveStreamIO.use((socket, next) => {
        const socketId = socket.handshake.auth.socketId;


        if (!socketId) {
            return next(new Error('Authentication error'));
        }

        socket.socketId = socketId;

        next();

    });

    // Event handler for the /live namespace
    liveStreamIO.on('connection', async (socket) => {
        try {
            const ids = await liveStreamIO.allSockets();
            console.log("io.allSockets() is currently:");
            console.log(ids);

            await setLiveStreamId(socket.socketId, "0");

            let user = await getUserData(socket.socketId);
            //  console.log(user);
            let userSubjects = [];
            for (let subject of user.subjects) {
                userSubjects.push(`${subject.id}`)
                socket.join(`${subject.id}`);
            }
            console.log(socket.rooms);
            // console.log(user.livestream_id);
            Livestream.find({ subjectID: { $in: userSubjects } }).then((livestreams) => {

                socket.emit('init', livestreams);
            });
        } catch (e) {
            console.log(e);
        }

        socket.on('fetch', async () => {
            try {
                let user = await getUserData(socket.socketId);
                let userSubjects = [];
                for (let subject of user.subjects) {
                    userSubjects.push(`${subject.id}`)
                }
                Livestream.find({ subjectID: { $in: userSubjects } }).then((livestreams) => {

                    socket.emit('fetched', livestreams);
                });
            } catch (e) {
                console.log(e);
            }
        });

        socket.on('disconnect', async () => {
            console.log(socket.id, 'is disconnected');
            const userId = socket.socketId;

            try {
                // Find the user document with the corresponding ID
                const disconnectedUser = await getUserData(userId);

                if (!disconnectedUser || disconnectedUser.livestream_id == null || disconnectedUser.livestream_id == "0") {
                    return;
                }
                if (disconnectedUser.isDoctor == 0) {
                    const fetchedLivestream = await Livestream.findById(disconnectedUser.livestream_id);
                    //console.log(fetchedLivestream);
                    await fetchedLivestream.removeViewer(disconnectedUser);
                    let lsAfterLeaving = await Livestream.findById(fetchedLivestream._id);
                    liveStreamIO.to(fetchedLivestream.subjectID).emit('update-livestreams', lsAfterLeaving);

                } else {
                    // console.log(true);
                    // console.log(disconnectedUser.livestream_id);
                    const tobeDeletedLivestream = await Livestream.findById(disconnectedUser.livestream_id);
                    await Livestream.deleteOne({ _id: tobeDeletedLivestream._id });
                    liveStreamIO.to(tobeDeletedLivestream.subjectID).emit('end', tobeDeletedLivestream._id);
                }
                // Update the user document with null livestream field
                await setLiveStreamId(disconnectedUser.id, "0");
                socket.disconnect(true);

            } catch (err) {
                console.error(err);
            }
        });

        socket.on('create', async (data) => {

            try {

                const userBroadcster = await getUserData(data.broadcaster);
                if (userBroadcster == null || (userBroadcster.livestream_id != null && userBroadcster.livestream_id != "0")) {
                    socket.emit('createError');
                    //console.log("hi elie");
                    return;
                }

                const newLiveStream = new Livestream({
                    _id: new mongoose.Types.ObjectId(),
                    title: data.title,
                    description: data.description,
                    broadcaster: userBroadcster.id,
                    imageUrl: data.imageUrl,
                    subjectID: data.subjectID,
                });

                let nlivestream = await newLiveStream.save();
                await setLiveStreamId(nlivestream.broadcaster, nlivestream._id);
                nlivestream = await Livestream.findById(newLiveStream._id);

                socket.join(`${nlivestream._id}`);
                socket.emit('createSucceed', nlivestream);
                // console.log("true2");
                liveStreamIO.to(newLiveStream.subjectID).emit('create', nlivestream);


            } catch (e) {
                console.log(e);
                socket.emit('createError', e.message);
            }
        });

        socket.on('join-livestream', async (lsID) => {

            try {
                const fetchedLivestream = await Livestream.findById(lsID);
                const joinedUser = await getUserData(socket.socketId);
                await fetchedLivestream.addViewer({ id: joinedUser.id });
                let livestreamAfterJoin = await Livestream.findById(fetchedLivestream._id);
                if (joinedUser.isDoctor == 0) {
                    await setLiveStreamId(joinedUser.id, fetchedLivestream._id);
                }
                socket.join(`${fetchedLivestream._id}`);
                socket.emit('join-success');


                liveStreamIO.to(fetchedLivestream.subjectID).emit('update-livestreams', livestreamAfterJoin);
                //socket.join(lsID);
            } catch (e) {
                console.log(e);

                socket.emit('join-error');

            }


        });


        socket.on('leave-livestraem', async (lsId) => {
            try {
                const fetchedLivestream = await Livestream.findById(lsId);
                const userToLeave = await getUserData(socket.socketId);
                socket.leave(`${fetchedLivestream._id}`);
                if (userToLeave.id == fetchedLivestream.broadcaster) {


                    // Delete the livestream document from the database
                    await Livestream.deleteOne({ _id: fetchedLivestream._id });
                    // Notify all clients that the livestream has ended.
                    liveStreamIO.emit('end', fetchedLivestream._id);

                } else {
                    await fetchedLivestream.removeViewer(userToLeave);
                    let lsAfterLeaving = await Livestream.findById(fetchedLivestream._id);
                    //console.log(lsAfterLeaving);
                    liveStreamIO.emit('update-livestreams', lsAfterLeaving);
                    socket.emit('leave-success');
                }
                await setLiveStreamId(userToLeave.id, "0");

            } catch (e) {
                console.log(e);
                socket.emit('leave-error');
            }

        });
        socket.on('send-message', async (message, roomID, callback) => {
            try {
                const sender = await getUserData(socket.socketId);
                const messageToSave = {
                    senderId: `${sender.id}`,
                    messageBody: message,
                    senderName: sender.name
                }
                const liveStreamfet = await Livestream.findById(roomID);
                const savedMessage = await liveStreamfet.addMessage(messageToSave);
                callback({ sent: true });
                liveStreamIO.to(roomID).emit('recive-message', savedMessage);
            } catch (e) {
                console.log(e);
                callback({ sent: false });
            }
        });
    });
}

module.exports = setupSocketIO;