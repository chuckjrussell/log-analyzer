# log-analyzer

A minimal log analyzer meant to draw conclusions based on logs.

## Requirements

- Node.js 18 or higher
- Read access to the log files you want to analyze

**Note** This has been tested with NPM as a package manager, it may work with yarn, pnpm or bun, but it is untested so run at your own risk.

## Installation

To avoid NPM package pollution this package has not been rolled up and pushed to the global NPM registry, so it must be installed locally. To run the log analyzer, clone the repo then do the following:

Install Dependencies

```bash
npm i
```

Add symlink to the package so that you can run it from the command line

```bash
npm link
```

## Usage

### Command Line Interface

Analyze a log file by providing the path to your log file:

```bash
log-analyzer --log /path/to/your/logfile.log
```

Or use the short form:

```bash
log-analyzer -l /path/to/your/logfile.log
```

### Examples

```bash
# Analyze an Apache access log
log-analyzer --log /var/log/apache2/access.log

# Analyze an application log
log-analyzer -l ./logs/app.log

# Analyze a system log
log-analyzer --log /var/log/syslog
```

## Supported Log Formats

```txt
<client ip address> - <user | -> [<date>] "<http function> <endpoint> <protocol>" <response code> <port> "-" "<user-agent>" <extra data>
```

For example:

```txt
177.71.128.21 - - [10/Jul/2018:22:21:28 +0200] "GET /intranet-analytics/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (X11; U; Linux x86_64; fr-FR) AppleWebKit/534.7 (KHTML, like Gecko) Epiphany/2.30.6 Safari/534.7"
168.41.191.40 - - admin [09/Jul/2018:10:11:30 +0200] "GET http://example.net/faq/ HTTP/1.1" 200 3574 "-" "Mozilla/5.0 (Linux; U; Android 2.3.5; en-us; HTC Vision Build/GRI40) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"
```

## Options

| Option         | Short       | Description                          |
| -------------- | ----------- | ------------------------------------ |
| `--log <path>` | `-l <path>` | Path to the log file to analyze      |
| `--top <#>`    | `-t <#>`    | Number of top results in the summary |
| `--help`       | `-h`        | Display help information             |
| `--version`    | `-V`        | Display version information          |

## Output

The analyzer provides comprehensive insights including:

- **Unique IP Addresses**: Total number of unique IP Addresses
- **Most visited URLS**: The top 3 most visited IP Addresses
- **Most active IP Addresses**: The top 3 most active IP Addressed

**Note** Because Javascripts sorting is non-stable, ties for most values are decided to be ordered randomly. This is an area that there can be some improvement in future releases if the demand is high enough.

## Development

### Testing

```bash
npm test
npm run test:watch
```

### Building

```bash
npm run build
npm run build:watch
```
