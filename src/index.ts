import { existsSync as fileExists, readFileSync as readFile } from "fs";
import * as errors from "./errors";

interface Item {
	key: string;
	value: string;
}

interface Section {
	children?: INIData;
	items?: Items;
}

type Items = Array<Item>;
type SectionName = string;
type INIData = Map<SectionName, Section>;

export class INIParser {
	protected readonly data: INIData;

	constructor(filePath: string) {
		if (!fileExists(filePath)) {
			throw new errors.fileDoesNotExists(filePath);
		}

		this.data = new Map();
		this.data.set("global", {});

		const fileLines: Array<string> = readFile(filePath, { encoding: "utf-8" }).split("\n");

		let lastSection: Section = this.global;
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

					lastSection = <Section>lastSection.children.get(sectionName);
				}
			} else {
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

	public get(path: string): Section | undefined {
		let section = this.global;
		for (const sectionName of path.trimStart().trimEnd().split(".")) {
			if (sectionName.includes(" ")) {
				throw new errors.SectionCannotContainSpaces(sectionName);
			}

			if (!section.children || !section.children.has(sectionName)) {
				return;
			}

			section = <Section>section.children.get(sectionName);
		}
		return section;
	}

	public getArray(key: string, section: Section | Items): Array<Items> {
		if (!Array.isArray(section) && !section.items) {
			throw new errors.SectionMustHaveItems();
		}

		const list: Map<string, Items> = new Map();
		for (const item of Array.isArray(section) ? section : <Items>section.items) {
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

		const array: Array<Items> = [];
		for (const [_, items] of list) {
			array.push(items);
		}

		return array;
	}

	public tree(s?: Section, father?: string): void {
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

	public static getValue(key: string, section: Section | Items): string | undefined {
		if (!Array.isArray(section) && !section.items) {
			throw new errors.SectionMustHaveItems();
		}

		for (const item of Array.isArray(section) ? section : <Items>section.items) {
			if (item.key == key) {
				return item.value;
			}
		}
	}

	public static hasKey(key: string, section: Section | Items): boolean {
		if (!Array.isArray(section) && !section.items) {
			throw new errors.SectionMustHaveItems();
		}

		for (const item of Array.isArray(section) ? section : <Items>section.items) {
			if (item.key == key) {
				return true;
			}
		}

		return false;
	}

	protected get global(): Section {
		return <Section>this.data.get("global");
	}
}
