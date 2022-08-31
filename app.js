const express = require("express");
const app = express();
const cors = require("cors");
const compression = require("compression");
const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT;

app.use(cors());
app.use(compression());

const socket_cors = {
  cors: {
    // origin: "http://localhost:3000",
    origin: "*",
    methods: ["GET", "POST"],
  },
};

// app.get("/", (req, res, next) => {
//   res.send("Hello Nodejs!");
// });

let startTime;
let endTime;

const http_server = require("http").createServer(app).listen(PORT);
console.log(`Server ready at http://localhost:${PORT}`);
const io = require("socket.io")(http_server, socket_cors);

io.on("connection", (socket) => {
  socket.emit("getid", socket.id);

  socket.on("caller", (data) => {
    console.log(`소켓: ${socket.id}의 전화 요청`);

    io.to(data.ToCall).emit("caller", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("answerCall", (data) => {
    console.log("데이터? ========================== \n", data);
    io.to(data.to).emit("acceptcall", data.signal);
    startTime = new Date();
    console.log("통화 시작 시간 : \n", startTime);
  });
});
