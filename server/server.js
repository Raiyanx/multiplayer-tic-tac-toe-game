const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

var allSockets = []

io.on('connection', socket => {
    allSockets.push(socket);
    displaySockets();
    socket.on('disconnect', () => {
        const newSockets = [];
        allSockets.forEach((sock) => {
            if(sock.id != socket.id){
                newSockets.push(sock);
            }
        })
        allSockets = newSockets;
        displaySockets();
    })

    socket.on('join-room', async (room, cb) => {
        console.log(`finding in ${room}`);
        let countx = await io.in(room).allSockets()
        console.log(countx);
        let count = countx.size;
        console.log(`count: ${count}`)
        if(count == 0){
            cb("There are no such rooms");
        }
        else if(count == 1){
            socket.join(room);
            cb(`You joined ${room}`)
        }
        else{
            cb("There are already 2 people in this room")
        }
        
        
    })

    socket.on('create-room', async room => {
        await socket.join(room);
        console.log(`${socket.id} created ${room}`)
        let countx = await io.in(room).allSockets()
        console.log(countx);
    })

    socket.on("trigger-click", async id => {
        await socket.broadcast.emit("trigger-click", id);
    })

})

function displaySockets(){
    console.log(`There are now ${allSockets.length} sockets`); 
    console.log('All socket ids are: ')
    allSockets.forEach(socket => console.log(socket.id));
}