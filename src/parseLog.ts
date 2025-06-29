import { HttpMethod, HttpStatusCode, LogType } from "./parseLog.types";
import moment from "moment";

/**
 * The regex below gives the following match groups:
 * 1: client Ip Address
 * 2: unknown (-)
 * 3: role (- | admin)
 * 4: date
 * 5: method endpoint protocol
 * 6: response code
 * 7: port?
 * 8: unknown
 * 9: user-agent
 */
const logRegex =
  /(\S*)\s+(\S*)\s+(\S*)\s+\[(.*)\]\s+\"([^"]+)\"\s+(\d+)\s+(\S+)\s+\"(.*)\"\s+\"(.*)\"(?:.*?)/;

export function parseLog(log: string) {
  const result = log.match(logRegex);

  if (!result) return null;

  const request = result[5].split(" ");

  // Log date format
  //10/Jul/2018:22:21:28 +0200
  const date = moment(result[4], "DD/MMM/YYYY:HH:mm:ss ZZ").toDate();

  const parsedLog: LogType = {
    clientIp: result[1],
    role: result[3],
    date: date,
    request: {
      method: request[0] as HttpMethod,
      endpoint: request[1],
      protocol: request[2],
    },
    responseCode: result[6] as HttpStatusCode,
    port: result[7],
    userAgent: result[9],
  };

  return parsedLog;
}
