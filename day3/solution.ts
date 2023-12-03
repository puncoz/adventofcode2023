import { benchmark, readInputFile } from "../utils/helpers"

const direction = [
  [-1, -1], // TOP-LEFT
  [0, -1], // TOP
  [1, -1], // TOP-RIGHT

  [-1, 0], // LEFT
  [1, 0], // RIGHT

  [-1, 1], // BOTTOM-LEFT
  [0, 1], // BOTTOM
  [1, 1], // BOTTOM-RIGHT
]

const _checkIfValidPart = (initialCoords: [number, number], length: number, inputArr: string[][]): boolean => {
  let valid = false

  for (let i = 0; i < length; i++) {
    valid = false
    for (let d = 0; d < direction.length; d++) {
      const x = initialCoords[0] + direction[d][0]
      const y = initialCoords[1] + i + direction[d][1]

      if (x < 0 || y < 0 || x >= inputArr.length || y >= inputArr[0].length) {
        continue
      }
      const symbol = inputArr[x][y]
      if (symbol !== "." && isNaN(parseInt(symbol))) {
        valid = true
        break
      }
    }

    if (valid) {
      break
    }
  }

  return valid
}

const _getGears = (initialCoords: [number, number], length: number, inputArr: string[][]): string[] => {
  const gears = []
  for (let i = 0; i < length; i++) {
    for (let d = 0; d < direction.length; d++) {
      const x = initialCoords[0] + direction[d][0]
      const y = initialCoords[1] + i + direction[d][1]

      if (x < 0 || y < 0 || x >= inputArr.length || y >= inputArr[0].length) {
        continue
      }
      const symbol = inputArr[x][y]
      if (symbol === "*") {
        gears.push(`${x}-${y}`)
      }
    }
  }

  return gears.filter((gear, index) => gears.indexOf(gear) === index)
}

const _extractParts = (input: string[]) => {
  const parts = []
  const inputArr = []

  for (let i = 0; i < input.length; i++) {
    inputArr[i] = input[i].split("")
    const matches = input[i].matchAll(/\d+/g)

    for (const match of matches) {
      parts.push([match[0], [i, match.index as number]])
    }
  }

  return { parts, inputArr }
}

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((schematic: string) => !!schematic).map(String)
}

const partOne = async (input: string[]) => {
  const { parts, inputArr } = _extractParts(input)

  const sumOfParts = parts.filter((partInfo) => {
    return _checkIfValidPart(partInfo[1], partInfo[0].length, inputArr)
  }).reduce((sum, partNumber) => {
    return sum + parseInt(partNumber)
  }, 0)

  console.log(`Part I: Sum of parts = ${sumOfParts}`)
}

const partTwo = async (input: string[]) => {
  const { parts, inputArr } = _extractParts(input)

  type Gears = {
    [key: string]: string[]
  }
  const gears: Gears = parts.reduce((gearsParts: Gears, partInfo) => {
    const gears = _getGears(partInfo[1], partInfo[0].length, inputArr)

    gears.forEach((gear) => {
      gearsParts[gear] = [...(gearsParts[gear] || []), partInfo[0]]
    })

    return gearsParts
  }, {})

  const sumOfGearRatios = Object.entries(gears).filter(([gear, parts]) => {
    return parts.length >= 2
  }).reduce((sum, [gear, parts]) => {
    const gearRatio = parts.reduce((gr, part) => {
      return gr * parseInt(part)
    }, 1)
    return sum + gearRatio
  }, 0)

  console.log(`Part II: Sum of gear ratios = ${sumOfGearRatios}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
