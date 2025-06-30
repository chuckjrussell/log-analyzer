import {
  HttpMethod,
  HttpStatusCode,
  LogType,
  RequestType,
} from "./parseLog.types";
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

const logGroups = {
  clientIpAddress: 1,
  role: 3,
  date: 4,
  request: 5,
  response: 6,
  port: 7,
  userAgent: 9,
};

export function parseLog(log: string) {
  const result = log.match(logRegex);

  if (!result) return null;

  // Request format:
  // METHOD Uri Protocol
  // ie "GET /intranet-analytics/ HTTP/1.1"
  const splitRequest = result[logGroups.request].split(" ");
  if (splitRequest.length !== 3) {
    //method, uri, protocol (3)
    return null;
  }

  const request: RequestType = {
    method: splitRequest[0] as HttpMethod,
    endpoint: splitRequest[1],
    protocol: splitRequest[2],
  };

  // Log date format
  // 10/Jul/2018:22:21:28 +0200
  const date = moment(result[4], "DD/MMM/YYYY:HH:mm:ss ZZ").toDate();

  const parsedLog: LogType = {
    clientIp: result[logGroups.clientIpAddress],
    role: result[logGroups.role],
    responseCode: result[logGroups.response] as HttpStatusCode,
    port: result[logGroups.port],
    userAgent: result[logGroups.userAgent],
    date: date,
    request: request,
  };

  return parsedLog;
}
