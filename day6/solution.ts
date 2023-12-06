import { benchmark, readInputFile } from "../utils/helpers"

const findMinMaxTime = (time: number, distanceRequired: number) => {
  let min = 0
  let max = 0

  for (let i = 0; i <= (time / 2); i++) {
    if (!min) {
      const distanceCovered = (time - i) * i

      if (distanceCovered > distanceRequired) {
        min = i
      }
    }

    if (!max) {
      const distanceCovered = i * (time - i)

      if (distanceCovered > distanceRequired) {
        max = time - i
      }
    }

    if (max && min) {
      break
    }
  }

  return [min, max]
}

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((cards: string) => !!cards).map(String)
}

const partOne = async (input: string[]) => {
  const times = input[0].split(/\s+/).map(Number).filter(n => !!n)
  const distances = input[1].split(/\s+/).map(Number).filter(n => !!n)

  const totalPossibleWays = times.reduce((possibleWays, time, timeIndex) => {
    const distanceRequired = distances[timeIndex]
    const [min, max] = findMinMaxTime(time, distanceRequired)
    const numberOfWays = max - min + 1

    return possibleWays * numberOfWays
  }, 1)

  console.log(`Part I: Total possible ways = ${totalPossibleWays}`)
}

const partTwo = async (input: string[]) => {
  const time = input[0].split(/\s+/).map(Number).filter(n => !!n).join("")
  const distanceRequired = input[1].split(/\s+/).map(Number).filter(n => !!n).join("")

  const [min, max] = findMinMaxTime(parseInt(time), parseInt(distanceRequired))
  const numberOfWays = max - min + 1

  console.log(`Part II: Number of ways = ${numberOfWays}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
