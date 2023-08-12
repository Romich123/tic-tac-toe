import { z } from "zod"

const envSchema = z.object({
    PORT: z.string().optional(),
    SECRET: z.string(),
})

try {
    envSchema.parse(process.env)
} catch (e) {
    throw new Error(`.env file doesn't exist or doesn't contain all necessary variables.
    .env must contain:
    PORT=number     # optional
    SECRET="string" # necessary`)
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT?: string
            SECRET: string
        }
    }
}

export {}
