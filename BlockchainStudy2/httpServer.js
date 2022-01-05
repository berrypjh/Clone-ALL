const express = require("express")
const { nextBlock, getBlocks, getVersion } = require("./chainedBlock")
const { addBlock } = require("./checkValidBock")
const { connectToPeers, getSockets } = require("./p2pServer")

const http_port = process.env.HTTP_PORT || 3002

function initHttpServer() {
  const app = express()
  app.use(express.json())

  // curl -H "Content-Type:application/json" --data "{\"data\":[ \"ws://localhost:6002\", \"ws://localhost:6003\" ]}" http://localhost:3001/addPeers

  setTimeout(() => broadcast(message), 1000);

  app.post("/addPeers", (req, res) => {
    const data = req.body.data || []
    console.log(data);
    connectToPeers(data);
    res.send(data);
  })

  app.get("/peers", (req, res) => {   
    let sockInfo = []
    // console.log(getSockets());
    getSockets().forEach(
      (s) => {
        sockInfo.push(s._socket.remoteAddress + ":" + s._socket.remotePort)
      }
    )
    res.send(sockInfo)
  })

  app.get("/blocks", (req, res) => {
    res.send(getBlocks())
  })

  app.post("/mineBlock", (req, res) => {
    const data = req.body.data || []
    const block = nextBlock(data)
    addBlock(block)

    res.send(block)
  })

  app.get("/version", (req, res) => {
    res.send(getVersion())
  })

  app.post("/stop", (req, res) => {
    res.send({ "msg" : "Stop Server!" })
    process.exit()
  })

  app.listen(http_port, () => {
    console.log("Listening Http Port : " + http_port);
  })
}

initHttpServer();