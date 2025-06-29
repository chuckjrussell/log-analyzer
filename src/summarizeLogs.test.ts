import { LogType } from "./parseLog.types";
import { createLogAnalyzer } from "./summarizeLogs";
import { simpleLog } from "./__mocks__/simpleLog";

describe("Single Log Parsing", () => {
  it("should be empty on initialization", () => {
    const logAnalyzer = createLogAnalyzer();
    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(0);
    expect(summary.topActiveVisitors).toEqual([]);
    expect(summary.topVisitedUrls).toEqual([]);
  });

  it("should not be empty oninitialization ", () => {
    const logAnalyzer = createLogAnalyzer();

    const log: LogType = {
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

    logAnalyzer.addLog(log);

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(1);
    expect(summary.topActiveVisitors).toEqual(["177.71.128.21"]);
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("mutiple requests from the same client shouldn't affect unique visitors.", () => {
    const logAnalyzer = createLogAnalyzer();

    const log: LogType = {
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

    logAnalyzer.addLog({ ...log });
    logAnalyzer.addLog({ ...log });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(1);
    expect(summary.topActiveVisitors).toEqual(["177.71.128.21"]);
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("Multiple different clients should increment summary visitors values", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({ ...simpleLog, clientIp: "177.71.128.21" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(2);
    //sorting is needed to assert equality when counts match
    expect(summary.topActiveVisitors.sort()).toEqual(
      ["177.71.128.21", "0.0.0.0"].sort()
    );
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("should order the active visitors count by number of visits", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({ ...simpleLog, clientIp: "177.71.128.21" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(2);
    expect(summary.topActiveVisitors).toEqual(["0.0.0.0", "177.71.128.21"]);
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("should handle changing the default limit result count", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({ ...simpleLog, clientIp: "177.71.128.21" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });

    const summary = logAnalyzer.getSummary(1);
    expect(summary.uniqueVisitors).toBe(2);
    expect(summary.topActiveVisitors).toEqual(["0.0.0.0"]);
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("should accurately capture multiple hits of the same endpoint", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({
      ...simpleLog,
      request: { ...simpleLog.request, endpoint: "/intranet-analytics/" },
    });
    logAnalyzer.addLog({
      ...simpleLog,
      request: { ...simpleLog.request, endpoint: "/intranet-analytics/" },
    });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(1);
    expect(summary.topActiveVisitors).toEqual(["177.71.128.21"]);
    expect(summary.topVisitedUrls).toEqual(["/intranet-analytics/"]);
  });

  it("should accurately capture multiple endpoint unique hits", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({
      ...simpleLog,
      request: { ...simpleLog.request, endpoint: "/intranet-analytics/" },
    });
    logAnalyzer.addLog({
      ...simpleLog,
      request: {
        ...simpleLog.request,
        endpoint: "http://example.com/example/",
      },
    });
    logAnalyzer.addLog({
      ...simpleLog,
      request: {
        ...simpleLog.request,
        endpoint: "http://example.com/example/",
      },
    });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(1);
    expect(summary.topActiveVisitors).toEqual(["177.71.128.21"]);
    expect(summary.topVisitedUrls).toEqual([
      "http://example.com/example/",
      "/intranet-analytics/",
    ]);
  });

  it("should handle both multiple visitors and multiple endpoint hits", () => {
    const logAnalyzer = createLogAnalyzer();

    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "0.0.0.0" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "192.168.2.1" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "192.168.2.1" });
    logAnalyzer.addLog({ ...simpleLog, clientIp: "192.168.2.1" });

    logAnalyzer.addLog({
      ...simpleLog,
      request: { ...simpleLog.request, endpoint: "/intranet-analytics/" },
    });
    logAnalyzer.addLog({
      ...simpleLog,
      clientIp: "192.168.2.1",
      request: {
        ...simpleLog.request,
        endpoint: "http://example.com/example/",
      },
    });
    logAnalyzer.addLog({
      ...simpleLog,
      clientIp: "192.168.2.1",
      request: {
        ...simpleLog.request,
        endpoint: "http://example.com/example/",
      },
    });

    const summary = logAnalyzer.getSummary();
    expect(summary.uniqueVisitors).toBe(3);
    expect(summary.topActiveVisitors).toEqual([
      "192.168.2.1",
      "0.0.0.0",
      "177.71.128.21",
    ]);
    expect(summary.topVisitedUrls).toEqual([
      "/intranet-analytics/",
      "http://example.com/example/",
    ]);
  });
});
