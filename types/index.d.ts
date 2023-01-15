declare interface Section {
    [key: string]: string | { [name: string]: Section }
    __children: { [name: string]: Section }
}

declare type Sections = { [name: string]: Section }

export class INIFile {
	private readonly data: Sections
    constructor (data: Sections)
    public get global (): Sections
}

export function parseFile (path: string): INIFile

export default parseFile
