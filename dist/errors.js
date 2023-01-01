"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SectionMustHaveItems = exports.CannotDeclareItemOutsideASection = exports.SectionCannotContainSpaces = exports.fileDoesNotExists = void 0;
class fileDoesNotExists extends Error {
    constructor(filePath) {
        super(`file '${filePath}' does not exists`);
    }
}
exports.fileDoesNotExists = fileDoesNotExists;
class SectionCannotContainSpaces extends Error {
    constructor(sectionName) {
        super(`section in '${sectionName}' cannot contain spaces`);
    }
}
exports.SectionCannotContainSpaces = SectionCannotContainSpaces;
class CannotDeclareItemOutsideASection extends Error {
    constructor(item) {
        super(`trying to declare '${item}' outside a section`);
    }
}
exports.CannotDeclareItemOutsideASection = CannotDeclareItemOutsideASection;
class SectionMustHaveItems extends Error {
    constructor() {
        super("section must have items");
    }
}
exports.SectionMustHaveItems = SectionMustHaveItems;
