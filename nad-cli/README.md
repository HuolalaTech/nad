# nad-cli · [![LICENSE](https://img.shields.io/npm/l/@huolala-tech/nad-cli)](LICENSE.txt)

A CLI tool, can generate client code from an API service
that has installed and enabled the [nad-java-sdk](../nad-java-sdk).

## Include

```bash
yarn add @huolala-tech/nad-cli -D
```

or

```bash
npm install @huolala-tech/nad-cli --save-dev
```

## Usage

```
Usage: nad [Options] <URL>
       nad --config <Path>
       nad -c <Path>

Example: nad http://localhost:8080
         nad -t oc http://localhost:8080

Options:
  -t, --target <target>     Specify the output file format ("ts", "oc", "raw"), defaults to "ts".
  -o, --output <path>       Specify the output file path, defaults to stdout.
  -c, --config <path>       Path to configuration file. If specified, all other arguments will be ignored.
  -h, --help                Display this help message.
```
