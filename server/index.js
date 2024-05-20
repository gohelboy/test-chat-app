const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const http = require('http');
const httpServer = http.createServer(app);

const { Server } = require('socket.io');
const connection = require('./db/connection');
const { userModel } = require('./Models/userModel');
const Conversation = require('./Models/conversationModal');
const io = new Server(httpServer, {
    cors: {
        origin: '*', // Replace with your React app's origin
        methods: ['GET', 'POST'] // Specify the allowed HTTP methods
    }
});

const PORT = 5000;
app.use(cors());
app.use(express.json());

io.on('connection', async (socket) => {
    const { username } = socket.handshake.query;

    // see if user exists
    const userFound = await userModel.findOne({ username: username })
    if (!userFound) {

        //create user and attatch socket id
        const newUser = userModel.create({ username: username, socketID: socket.id });
        await newUser.save()
    }
    if (!userFound?.socketID) {

        // user found but not have socket id then attatch new socket id
        userFound.socketID = socket.id;
        await userFound.save();
    }
    if (userFound.socketID) {

        // update socket id with ne one everytime
        userFound.socketID = socket.id;
        await userFound.save();
        console.log(userFound.username + " connected to chat");
    }

    socket.on("sendMessage", (data) => {
        createOrFindConversation(data.sender, data.receiver, data.message).catch(error => console.error('Error:', error));
    });
})



const createOrFindConversation = async (user1Id, user2Id, message) => {
    try {

        const sender = await userModel.findOne({ username: user1Id })
        const receiver = await userModel.findOne({ username: user2Id })

        if (!sender || !receiver) return console.log("sender or receiver not found!");


        // find conversation between two
        let conversation = await Conversation.findOne({
            $and: [
                { participants: sender._id },
                { participants: receiver._id },
                { participants: { $size: 2 } }
            ]
        });

        if (!conversation) {
            // if conversation is not found create a new conversation
            conversation = await Conversation.create({
                participants: [sender._id, receiver._id],
                messages: [{ sender: sender, senderName: sender.username, content: message }]
            });
        } else {
            // conversation exists push message to conversation
            conversation.messages.push({ sender: sender, senderName: sender.username, content: message })
        }
        await conversation.save();

        //notify sender and reciever about conversation
        io.to(sender.socketID).to(receiver.socketID).emit('receiveMessage', {
            senderName: sender.username,
            receiverName: receiver.username,
            content: message
        });

    } catch (error) {
        console.error('Error occurred during conversation handling:', error);
        throw error;
    }
};


app.post("/get-chat", async (req, res) => {
    const { sender, receiver } = req.body;
    console.log(sender, receiver)
    if (!sender || !receiver) return res.status(404).json({ message: 'Invalid parameters', status: false });

    const senderExists = await userModel.findOne({ username: sender });
    const receiverExists = await userModel.findOne({ username: receiver });

    if (!senderExists || !receiverExists) return res.status(400).json({ message: 'Sender or receiver not available!', status: false });

    const chats = await Conversation.findOne({
        $and: [
            { participants: senderExists._id },
            { participants: receiverExists._id },
            { participants: { $size: 2 } }
        ]
    }, { messages: 1 });

    return res.status(200).json({ data: chats, message: "messages" });
})

app.get("/", (req, res) => {
    return res.send("<h1>server in running...</h1>");
});

httpServer.listen(PORT, () => {
    connection.then(() => console.log("database connected")).catch(err => console.log("DB ERROR:" + err?.message))
    console.log("server listening on port " + PORT);
});
