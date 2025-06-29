import { LogType } from "../parseLog.types";

export const simpleLog: LogType = {
  clientIp: "177.71.128.21",
  date: new Date(2018, 6, 10, 22, 21, 28),
  role: "-",
  request: {
    method: "GET",
    endpoint: "/intranet-analytics/",
    protocol: "HTTP/1.1",
  },
  responseCode: "200",
  port: "3574",
  userAgent:
    "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7",
};
