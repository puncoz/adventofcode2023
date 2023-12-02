import { benchmark, readInputFile } from "../utils/helpers"

const MAX = {
  red: 12,
  green: 13,
  blue: 14,
}

type CUBE = "green" | "red" | "blue"
type CUBE_COUNT = {
  [type in CUBE]: number
}

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((games: string) => !!games).map(String)
}

const partOne = async (input: string[]) => {
  const sumOfValidGames = input.reduce((sum, gameStr, gameIndex) => {
    const [_, setsStr] = gameStr.split(":")
    const sets = setsStr.trim().split(";")

    const isValid = sets.map((cubesStr) => {
      const cubes = cubesStr.trim().split(",").reduce((count: CUBE_COUNT, cube) => {
        const matches = cube.trim().match(/(\d+)\s(green|red|blue)/)

        const cubeType = matches![2] as CUBE
        const cubeCnt = parseInt(matches![1])

        return {
          ...count,
          [cubeType]: count[cubeType] + cubeCnt,
        }
      }, { green: 0, red: 0, blue: 0 })

      return cubes.green <= MAX.green && cubes.blue <= MAX.blue && cubes.red <= MAX.red
    }).every(s => s)

    return sum + (isValid ? gameIndex + 1 : 0)
  }, 0)

  console.log(`Part I: Sum of valid games = ${sumOfValidGames}`)
}

const partTwo = async (input: string[]) => {
  const sumOfPower = input.reduce((sum, gameStr, gameIndex) => {
    const [_, setsStr] = gameStr.split(":")
    const sets = setsStr.trim().split(";")

    const maxCubes = sets.reduce((maxCubes: CUBE_COUNT, cubesStr) => {
      const cubes = cubesStr.trim().split(",").reduce((count: CUBE_COUNT, cube) => {
        const matches = cube.trim().match(/(\d+)\s(green|red|blue)/)

        const cubeType = matches![2] as CUBE
        const cubeCnt = parseInt(matches![1])

        return {
          ...count,
          [cubeType]: count[cubeType] + cubeCnt,
        }
      }, { green: 0, red: 0, blue: 0 })

      return {
        green: Math.max(maxCubes.green, cubes.green),
        red: Math.max(maxCubes.red, cubes.red),
        blue: Math.max(maxCubes.blue, cubes.blue),
      }
    }, { green: 0, red: 0, blue: 0 })

    const power = maxCubes.red * maxCubes.blue * maxCubes.green

    return sum + power
  }, 0)

  console.log(`Part II: Sum of power = ${sumOfPower}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
