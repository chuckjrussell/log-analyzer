import { parseLog } from "./parseLog";

describe("Single Log Parsing", () => {
  it("should return null when given an empty log", () => {
    const logResults = parseLog("");
    expect(logResults).toBeNull();
  });
  it("should return null when given a non-matching log", () => {
    const logResults = parseLog("test string");
    expect(logResults).toBeNull();
  });

  it("should return null when the request info isn't 3 items.", () => {
    const logResults = parseLog(
      `168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`
    );
    expect(logResults).toBeNull();
  });
  it("should return an object when given a matching log", () => {
    const logResults = parseLog(
      `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`
    );
    expect(logResults).not.toBeNull();
  });

  it("should have the correct strings in the properties of the parsed log", () => {
    const logResults = parseLog(
      `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`
    );
    expect(logResults).not.toBeNull();
    expect(logResults?.clientIp).toEqual("177.71.128.21");
    expect(logResults?.role).toEqual("-");
    expect(logResults?.responseCode).toEqual("200");
    expect(logResults?.port).toEqual("3574");
    expect(logResults?.userAgent).toEqual(
      "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
    );
  });

  it("should have the correct date object in the log", () => {
    const logResults = parseLog(
      `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`
    );
    expect(logResults?.date.getMonth()).toEqual(6); //JS Months are 0 indexed
    expect(logResults?.date.getUTCDate()).toEqual(10);
    expect(logResults?.date.getUTCFullYear()).toEqual(2018);
    expect(logResults?.date.getUTCHours()).toEqual(20);
    expect(logResults?.date.getMinutes()).toEqual(21);
    expect(logResults?.date.getSeconds()).toEqual(28);
  });

  it("should have the correct request details in the parsed log", () => {
    const logResults = parseLog(
      `177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"`
    );
    expect(logResults?.request.method).toEqual("GET");
    expect(logResults?.request.protocol).toEqual("HTTP/1.1");
    expect(logResults?.request.endpoint).toEqual("/intranet-analytics/");
  });

  it("should handle the optional role", () => {
    const logResults = parseLog(
      `50.112.00.11 - admin [11/Jul/2018:17:31:56 +0200] "GET /asset.js HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/536.6 (KHTML, like Gecko) Chrome/20.0.1092.0 Safari/536.6"`
    );
    expect(logResults?.role).toEqual("admin");
  });

  it("should handle a fully qualified URI", () => {
    const logResults = parseLog(
      `168.41.191.40 - - [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"`
    );
    expect(logResults?.request.endpoint).toEqual("http://example.net/faq/");
  });
  //add test for checking year when UTC Crosses the boundary
});
