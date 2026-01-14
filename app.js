const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const socketio = require('socket.io');
const port  = 3001;


const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname,"public")));
app.set('view engine','ejs');
app.set("views", path.join(__dirname, "views"));

io.on('connection',(uniqId)=>{
    console.log(`user of ${uniqId.id} connected.`);

    uniqId.on('send-location',(data)=>{
        io.emit('receive-location',{id:uniqId.id,...data})
    })

    uniqId.on('disconnect',(uniqId)=>{

         io.emit("user-disconnected", {
         id: uniqId.id,
         message: `User ${uniqId.id} disconnected`
    });
    })
});

app.get("/",(req,res)=>{
    res.render("index");
})

server.listen(port,(req,res)=>{
    console.log(`Server is running in the ${port}`)
})