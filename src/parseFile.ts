import fs from "fs";
import readline from "readline";
import { createLogAnalyzer } from "./summarizeLogs";
import { parseLog } from "./parseLog";

export async function parseFile(filePath: string) {
  let readInterface;
  try {
    readInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    const logAnalyzer = createLogAnalyzer();

    let successfullInputs = 0;
    let failedInputs = 0;

    for await (const line of readInterface) {
      await new Promise<void>((resolve) => {
        const log = parseLog(line);
        if (log != null) {
          logAnalyzer.addLog(log);
          successfullInputs++;
        } else {
          failedInputs++;
        }
        resolve();
      });
    }
    const summary = logAnalyzer.getSummary();

    console.log(`Parsed:     ${successfullInputs + failedInputs}`);
    console.log(`Successful: ${successfullInputs}`);
    console.log(`Failed:     ${failedInputs}`);
    console.log("");
    console.log("Stats:");
    console.log(`Unique Visits:   ${summary.uniqueVisitors}`);
    console.log(`Top 3 Visitors:  ${summary.topActiveVisitors}`);
    console.log(`Top 3 Urls:      ${summary.topVisitedUrls}`);
  } catch (err) {
    console.error("Error reading file input: " + err);
  }
}
