import { benchmark, readInputFile } from "../utils/helpers"

const _calculateCalibrationValue = (inp: string) => {
  const first = inp.match(/(?!.*\d)*(\d)/) ?? []
  const last = inp.match(/(\d)(?!.*\d)/) ?? []

  return parseInt(`${first[0]}${last[0]}`) || 0
}

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((num: string) => !!num).map(String)
}

const partOne = async (input: string[]) => {
  const calibrationValue = input.reduce((sum = 0, inp) => {
    return sum + _calculateCalibrationValue(inp)
  }, 0)

  console.log(`Part I: Calibration value = ${calibrationValue || 0}`)
}

const partTwo = async (input: string[]) => {
  const lookup = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"]
  const regex = new RegExp(lookup.join("|"), "g")

  const calibrationValue = input.reduce((sum = 0, inp) => {
    const cleanedInput = inp.replace(regex, matched => `${lookup.indexOf(matched) + 1}`.toString())
    return sum + _calculateCalibrationValue(cleanedInput)
  }, 0)

  console.log(`Part II: Calibration value = ${calibrationValue}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
