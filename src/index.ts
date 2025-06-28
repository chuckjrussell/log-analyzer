#!/usr/bin/env node

import { program } from "commander";

program
  .version("0.0.1")
  .description("Log Parser")
  .option("-l, --log <type>", "Log file location")
  .action((options) => {
    console.log(`Parsing Log File: ${options.log}!`);
  });

program.parse(process.argv);
