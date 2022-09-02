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

    socket.on('join-room', (room, cb) => {
        io.in(room).fetchSockets().then(res => {
            let count = res.length
            console.log(`count: ${count}`)
            if(count == 0){
                socket.join(room);
            }
            else{
                cb()
            }
        });
        
    })

    socket.on("trigger-click", id => {
        socket.broadcast.emit("trigger-click", id);
    })

})

function displaySockets(){
    console.log(`There are now ${allSockets.length} sockets`); 
    console.log('All socket ids are: ')
    allSockets.forEach(socket => console.log(socket.id));
}