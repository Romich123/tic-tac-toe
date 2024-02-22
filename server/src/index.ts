import dotenv from "dotenv"
dotenv.config({ path: __dirname + "/../.env" })
import * as trpcExpress from "@trpc/server/adapters/express"
import { Server } from "socket.io"
import { appRouter, createContext } from "./trpc"
import express from "express"
import cors from "cors"
import http from "http"
import gameHandler from "./controllers/gameHandler"
import "./env"

const app = express()

app.use(
    cors({
        origin: "*",
    })
)

const server = http.createServer(app)

export const io = new Server(server, {
    cors: {
        origin: "*",
    },
})

io.on("connection", (socket) => {
    gameHandler(socket)
})

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

app.use(express.static(__dirname + "/public"))

const port = Number(process.env.PORT || 3000)
server.listen(port, () => {
    console.log("started on " + port)
})
