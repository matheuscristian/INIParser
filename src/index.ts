import { readFileSync as readFile } from 'node:fs'

export interface Section {
  [key: string]: string | { [name: string]: Section }
  __children: { [name: string]: Section }
}

type Sections = { [name: string]: Section }

export class INIFile {
  private readonly data: Sections

  constructor (data: Sections) {
    this.data = data
  }

  public get global (): Sections {
    return this.data
  }
}

export function parseFile (path: string): INIFile {
  const file = readFile(path, { encoding: 'utf-8' })

  const data: Section = { __children: {} }

  let lastSection: Section = data
  for (let line of file.split('\n')) {
    line = line.trimStart().trimEnd()

    if (line[0] === '#' || line[0] === ';' || line === '') continue

    if (line.startsWith('[') && line.endsWith(']')) {
      lastSection = data

      for (const sectionName of line.slice(1, -1).split('.')) {
        if (!lastSection.__children[sectionName]) lastSection.__children[sectionName] = { __children: {} }

        lastSection = lastSection.__children[sectionName]
      }
    } else {
      let [key, value] = line.split('=')

      key = key.trimEnd()
      if (key === '__children') continue

      if (value) value = value.trimStart()
      else value = ''

      lastSection[key] = value
    }
  }

  return new INIFile(data.__children)
}

export default parseFile
