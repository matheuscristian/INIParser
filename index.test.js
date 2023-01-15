const { parseFile } = require(".")

const ini_file = parseFile("./stylesheet.ini")

console.table(ini_file.global.section)
console.table(ini_file.global.section.__children)
