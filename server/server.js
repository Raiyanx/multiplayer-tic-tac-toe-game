const io = require('socket.io')(3000, {
    cors: {
        origin: ['http://localhost:8080']
    }
})

var allSockets = []
const roomCross = new Map();         // socketid => iscross
const roomFirstPlayer = new Map();   // socketid => isfirstplayer

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
        roomCross.delete(socket.id.toString());
        roomFirstPlayer.delete(socket.id.toString());
    })

    socket.on('join-room', async (room, cb) => {
        console.log(`finding in ${room}`);
        let countx = await io.in(room).allSockets()
        console.log(countx);
        let count = countx.size;
        console.log(`count: ${count}`)
        if(count == 0){
            cb(0, null, null);
        }
        else if(count == 1){

            let secondSocket
            countx.forEach(elem => {
                secondSocket = elem
            })
            socket.join(room)

            console.log(secondSocket);

            console.log("Inside join-room")
            console.log(roomCross.get(secondSocket.toString()))
            console.log(roomFirstPlayer.get(secondSocket.toString()))
            console.log("exited join-room")


            cb(1, roomCross.get(secondSocket.toString()), roomFirstPlayer.get(secondSocket.toString()));
        }
        else{
            cb(2, null, null);
        }
        
        
    })


    socket.on("create-room", (room, cross, first) => {
        console.log(`${socket.id} created ${room}`);
        console.log(cross);
        console.log(first);
        socket.join(room);
        roomCross.set(socket.id.toString(), cross);
        roomFirstPlayer.set(socket.id.toString(), first);
    })

    socket.on("joined-room", room => {
        console.log("here");
        socket.to(room).emit("confirmed-joined-room", socket.id);
    })
 
    socket.on("trigger-click", (room, id) => {
        console.log(`click triggered with room=${room} and id=${id}`)
        socket.to(room).emit("trigger-cell", id);
    })

    socket.on("restart-game", room => {
        socket.to(room).emit("receive-restart-game");
    })

})
 
function displaySockets(){
    console.log(`There are now ${allSockets.length} sockets`); 
    console.log('All socket ids are: ')
    allSockets.forEach(socket => console.log(socket.id));
}