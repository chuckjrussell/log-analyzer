import { LogType } from "./parseLog.types";

/**
 * Creates a log analyzer which exposes two methods:
 * addLog - Allows you to add a log to the analyzer.
 * getSummary - Allows you to get a summary of the logs that have been analyzed so far.
 *
 * This analyzer is designed around performance and parsing high volume data, so it returns
 * an addLog method for you to use to add data to the rolling summary. It is intended to add
 * a single log at a time and build the summary as it is called repeatedly.
 *
 * In this manner it can be used without reading the entire file, or having all logs in memory
 * at once, helpful if, for instance it needs to be used in a long running web service or
 * in a file stream reader parsing millions of records.
 */
export function createLogAnalyzer() {
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
   * @param limitResultCount The number of items to display in the top sections
   * @returns and object of the shape {
   *   uniqueVisitors: number,
   *   topActiveVistitors: string[],
   *   topVisitedUrls: string[]
   * }
   */
  function getSummary(limitResultCount = 3) {
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
