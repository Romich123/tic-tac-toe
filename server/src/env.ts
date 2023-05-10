import { z } from "zod"

const envSchema = z.object({
    PORT: z.string().optional(),
    SECRET: z.string(),
})

envSchema.parse(process.env)

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string
            SECRET: string
        }
    }
}

export {}
