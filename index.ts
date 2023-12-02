import { isFileExists } from "./utils/helpers"

(async () => {
  const day: number = parseInt(process.argv[2])

  if (isNaN(day) || day < 1 || day > 31) {
    throw new Error("A valid day number should be passed.")
  }

  const solutionFile = `./day${day}/solution.ts`
  const isSolutionExists = await isFileExists(solutionFile)
  if (!isSolutionExists) {
    throw new Error(`No solution found for the day ${day}`)
  }

  const isTest = process.argv[3] === "true"
  const testCase = parseInt(process.argv[4]) || 1

  const { solution } = await import(solutionFile)
  solution(isTest, testCase)
})()
