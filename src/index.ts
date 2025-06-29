#!/usr/bin/env node

import { program } from "commander";
import { parseFile } from "./parseFile";

program
  .version("0.0.1")
  .description("Log Parser")
  .option("-l, --log <type>", "Log file location")
  .option(
    "-t, --top <type>",
    "Specifies how many of the top visitors should be displayed"
  )
  .action((options) => {
    if (!options.log) {
      console.error("Must specify a log file path to parse");
      return;
    }
    console.log(`Parsing Log File: ${options.log}!`);
    parseFile(options.log, options.top);
  });

program.parse(process.argv);
