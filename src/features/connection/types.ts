import { ConnectionStatus } from "@prisma/client";


export type FetchConnReqSearchParams = {
  [key: string]: string | string[] | undefined;
  status?: ConnectionStatus | "all";
  direction?: "incoming" | "outgoing" | "all";
};
