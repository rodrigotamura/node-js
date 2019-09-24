const io = require("socket.io")(3000); // here we need set the port

// Event listeners...
io.on("connection", socket => {
  console.log("New user connected");

  socket.on("client_message", data_from_client => {
    const data = data_from_client;

    /**
     * socket.emit(): only user who sent the message will receive
     * socket.broadcast.emit(): all connected users will receive
     *                          the message, except who sent
     * io.sockets.emit(): everybody will receive
     */

    console.log(data);
    io.sockets.emit("server_hello", data);
  });
});
