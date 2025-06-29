import { LogType } from "./parseLog.types";

export function createLogAnalyzer(limitResultCount = 3) {
  const ipAddresses = new Map<string, number>();
  const urlVisits = new Map<string, number>();

  /**
   * Adds a parsed log to the rolling summaries.
   * @param log The log item to add to the running summary
   */
  function addLog(log: LogType) {
    let currentValue = 0;
    if (ipAddresses.has(log.clientIp)) {
      currentValue = ipAddresses.get(log.clientIp) as number; //we know this exists from above
    }
    ipAddresses.set(log.clientIp, currentValue + 1);

    let currentUrlVisit = 0;
    if (urlVisits.has(log.request.endpoint)) {
      currentUrlVisit = urlVisits.get(log.request.endpoint) as number; //we know this exists from above
    }
    urlVisits.set(log.request.endpoint, currentUrlVisit + 1);
  }

  /**
   * Get summary gets a running summary of the following information:
   * Unique visitors
   * Top N Visited Urls (sorted by frequency)
   * Top N Visitors (sorted by frequency)
   * @returns
   */
  function getSummary() {
    const topActiveVisitors = Array.from(ipAddresses.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitResultCount)
      .map(([key]) => key);

    const topVisitedUrls = Array.from(urlVisits.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limitResultCount)
      .map(([key]) => key);

    return {
      uniqueVisitors: ipAddresses.size,
      topActiveVisitors: topActiveVisitors,
      topVisitedUrls: topVisitedUrls,
    };
  }

  return { addLog, getSummary };
}
