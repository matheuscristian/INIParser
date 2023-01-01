export class fileDoesNotExists extends Error {
	constructor(filePath: string) {
		super(`file '${filePath}' does not exists`);
	}
}

export class SectionCannotContainSpaces extends Error {
	constructor(sectionName: string) {
		super(`section in '${sectionName}' cannot contain spaces`);
	}
}

export class CannotDeclareItemOutsideASection extends Error {
	constructor(item: string) {
		super(`trying to declare '${item}' outside a section`);
	}
}

export class SectionMustHaveItems extends Error {
    constructor() {
        super("section must have items");
    }
}
