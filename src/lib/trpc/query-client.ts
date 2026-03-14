import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const makeQueryClient = () => new QueryClient();

export const getQueryClient = cache(makeQueryClient);
