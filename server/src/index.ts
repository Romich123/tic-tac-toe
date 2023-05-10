import dotenv from "dotenv"
dotenv.config({ path: __dirname + "/../.env" })
import * as trpcExpress from "@trpc/server/adapters/express"
import { inferAsyncReturnType, initTRPC } from "@trpc/server"
import { Server } from "socket.io"
import { z } from "zod"
import { db } from "./db"
import { publicProcedure, router } from "./trpc"
import express from "express"
import cors from "cors"
import http from "http"
import gameHandler from "./controllers/gameHandler"
import "./env"

const app = express()

const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

const appRouter = t.router({
    userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
        const { input } = opts

        // Create a new user in the database
        const user = db.user.create(input)
        return user
    }),
})

export type AppRouter = typeof appRouter

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

app.use((req, res, next) => {
    res.status(200)
    return next()
})

app.use(
    "/trpc",
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    })
)

server.listen(3000, () => {
    console.log("started on 3000")
})
