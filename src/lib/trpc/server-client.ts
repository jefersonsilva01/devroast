import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createContext } from "@/server/context";
import { appRouter } from "@/server/routers/_app";
import { getQueryClient } from "./query-client";

export { getQueryClient };

export const trpc = createTRPCOptionsProxy({
	ctx: createContext,
	router: appRouter,
	queryClient: getQueryClient,
});
