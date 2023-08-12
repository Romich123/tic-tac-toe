import { inferAsyncReturnType, initTRPC } from "@trpc/server"
import * as trpcExpress from "@trpc/server/adapters/express"
import { z } from "zod"
import { db } from "./db"

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */

export const createContext = ({ req, res }: trpcExpress.CreateExpressContextOptions) => ({})
type Context = inferAsyncReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const publicProcedure = t.procedure

export const appRouter = t.router({
    userCreate: publicProcedure.input(z.object({ name: z.string() })).mutation(async (opts) => {
        const { input } = opts

        // Create a new user in the database
        const user = db.user.create(input)
        return user
    }),
})

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
