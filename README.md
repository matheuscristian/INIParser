<div align="center">
    <br />
    <p>
        <img src="https://img.shields.io/node/v/typescript" />
        <img src="https://img.shields.io/github/package-json/dependency-version/matheuscristian/INIParser/dev/typescript" />
    </p>
</div>
<hr />

## About

This is a JavaScript parser for [INI configuration files](https://en.wikipedia.org/wiki/INI_file).

## Example usage

*index.test.js*:

```js
// Import class
const INIParser = require(".").INIParser;
// Declare class passing the file path
const Parser = new INIParser("./stylesheet.ini");

// Print every section
Parser.tree();
```

*stylesheet.ini*:

```ini
[section]
key=value

[section.subsection]
key=value

array-key-1=index 1
array-key-2=index 2
```

*Result* after running the code:

```
section (global):
┌─────────┬───────┬─────────┐
│ (index) │  key  │  value  │
├─────────┼───────┼─────────┤
│    0    │ 'key' │ 'value' │
└─────────┴───────┴─────────┘
subsection (section):
┌─────────┬───────────────┬───────────┐
│ (index) │      key      │   value   │
├─────────┼───────────────┼───────────┤
│    0    │     'key'     │  'value'  │
│    1    │ 'array-key-1' │ 'index 1' │
│    2    │ 'array-key-2' │ 'index 2' │
└─────────┴───────────────┴───────────┘
```
