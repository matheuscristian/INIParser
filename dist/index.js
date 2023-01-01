"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INIParser = void 0;
const fs_1 = require("fs");
const errors = require("./errors");
class INIParser {
    data;
    constructor(filePath) {
        if (!(0, fs_1.existsSync)(filePath)) {
            throw new errors.fileDoesNotExists(filePath);
        }
        this.data = new Map();
        this.data.set("global", {});
        const fileLines = (0, fs_1.readFileSync)(filePath, { encoding: "utf-8" }).split("\n");
        let lastSection = this.global;
        for (let line of fileLines) {
            line = line.trimStart().trimEnd();
            if (line[0] == ";" || line[0] == "#" || line == "") {
                continue;
            }
            if (line[0] == "[" && line[line.length - 1] == "]") {
                if (line.includes(" ")) {
                    throw new errors.SectionCannotContainSpaces(line);
                }
                line = line.trim().slice(1, -1);
                lastSection = this.global;
                for (const sectionName of line.split(".")) {
                    if (!lastSection.children) {
                        lastSection.children = new Map();
                    }
                    if (!lastSection.children.has(sectionName)) {
                        lastSection.children.set(sectionName, {});
                    }
                    lastSection = lastSection.children.get(sectionName);
                }
            }
            else {
                if (lastSection == this.global) {
                    throw new errors.CannotDeclareItemOutsideASection(line);
                }
                let [key, value] = line.split("=");
                if (value) {
                    value = value.trimStart().trimEnd();
                }
                key = key.trimStart().trimEnd();
                if (!lastSection.items) {
                    lastSection.items = [];
                }
                lastSection.items.push({ key, value });
            }
        }
    }
    get(path) {
        let section = this.global;
        for (const sectionName of path.trimStart().trimEnd().split(".")) {
            if (sectionName.includes(" ")) {
                throw new errors.SectionCannotContainSpaces(sectionName);
            }
            if (!section.children || !section.children.has(sectionName)) {
                return;
            }
            section = section.children.get(sectionName);
        }
        return section;
    }
    getArray(key, section) {
        if (!Array.isArray(section) && !section.items) {
            throw new errors.SectionMustHaveItems();
        }
        const list = new Map();
        for (const item of Array.isArray(section) ? section : section.items) {
            if (item.key.startsWith(key) && item.key.includes("-")) {
                const properties = item.key.split("-");
                if (properties.length < 3) {
                    continue;
                }
                if (!list.has(properties[2])) {
                    list.set(properties[2], []);
                }
                list.get(properties[2])?.push({ key: properties[1], value: item.value });
            }
        }
        const array = [];
        for (const [_, items] of list) {
            array.push(items);
        }
        return array;
    }
    tree(s, father) {
        if (!s) {
            s = this.global;
        }
        if (!father) {
            father = "global";
        }
        if (s.items) {
            console.table(s.items);
        }
        if (s.children) {
            for (const [sectionName, section] of s.children) {
                if (section.items) {
                    console.log(sectionName, `(${father}):`);
                }
                this.tree(section, sectionName);
            }
        }
    }
    static getValue(key, section) {
        if (!Array.isArray(section) && !section.items) {
            throw new errors.SectionMustHaveItems();
        }
        for (const item of Array.isArray(section) ? section : section.items) {
            if (item.key == key) {
                return item.value;
            }
        }
    }
    static hasKey(key, section) {
        if (!Array.isArray(section) && !section.items) {
            throw new errors.SectionMustHaveItems();
        }
        for (const item of Array.isArray(section) ? section : section.items) {
            if (item.key == key) {
                return true;
            }
        }
        return false;
    }
    get global() {
        return this.data.get("global");
    }
}
exports.INIParser = INIParser;
