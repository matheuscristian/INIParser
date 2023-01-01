declare interface Item {
	key: string;
	value: string;
}

declare interface Section {
	children?: INIData;
	items?: Items;
}

declare type Items = Array<Item>;
declare type SectionName = string;
declare type INIData = Map<SectionName, Section>;

export class INIParser {
	protected readonly data: INIData;
	constructor(filePath: string);
	public get(path: string): Section | undefined;
	public getArray(array: string, section: Section | Items): Array<Items>;
	public table(): void;
	public static getValue(key: string, section: Section | Items): string | undefined;
	public static hasKey(key: string, section: Section | Items): boolean;
	protected get global(): Section;
}
