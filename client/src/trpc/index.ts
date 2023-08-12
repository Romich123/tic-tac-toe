import { createTRPCProxyClient, httpBatchLink } from "@trpc/client"
import type { AppRouter } from "../../../server/src/trpcType"

export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: import.meta.env.BASE_URL + "/trpc",
        }),
    ],
})
