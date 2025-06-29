import fs from "fs";
import readline from "readline";
import { createLogAnalyzer } from "./summarizeLogs";
import { parseLog } from "./parseLog";

/**
 * Given a file path, and configuration for how many of the top results to
 * show, parses a file and displays the results of the analysis
 * @param filePath The file path to read the logs from.
 * @param top The number of top records to display
 */
export async function parseFile(filePath: string, top = 3) {
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
    const summary = logAnalyzer.getSummary(top);

    console.log(`Parsed:     ${successfullInputs + failedInputs}`);
    console.log(`Successful: ${successfullInputs}`);
    console.log(`Failed:     ${failedInputs}`);
    console.log("");
    console.log("Stats:");
    console.log(`Unique Visits:   ${summary.uniqueVisitors}`);
    console.log(
      `Top ${top} Visitors:  ${summary.topActiveVisitors.join(" | ")}`
    );
    console.log(`Top ${top} Urls:      ${summary.topVisitedUrls.join(" | ")}`);
  } catch (err) {
    console.error("Error reading file input: " + err);
  }
}
