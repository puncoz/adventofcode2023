import { benchmark, readInputFile } from "../utils/helpers"

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((cards: string) => !!cards).map(String)
}

const partOne = async (input: string[]) => {
  const totalPoints = input.reduce((sum, cardStr) => {
    const [_, card] = cardStr.split(":")
    const [winningNumStr, cardNumStr] = card.trim().split("|")

    const winningNumbers = winningNumStr.trim().split(" ").filter(n => !!n.trim()).map(Number)
    const cardNumbers = cardNumStr.trim().split(" ").filter(n => !!n.trim()).map(Number)

    return sum + winningNumbers.reduce((points, num) => {
      if (cardNumbers.includes(num)) {
        return points === 0 ? 1 : (points * 2)
      }

      return points
    }, 0)
  }, 0)

  console.log(`Part I: Total points = ${totalPoints}`)
}

const partTwo = async (input: string[]) => {
  type Obj = { [key: string]: number }
  const totalScratchcards = input.reduce((scratchcards: Obj, cardStr, cardIndex) => {
    const [_, card] = cardStr.split(":")
    const [winningNumStr, cardNumStr] = card.trim().split("|")

    const winningNumbers = winningNumStr.trim().split(" ").filter(n => !!n.trim()).map(Number)
    const cardNumbers = cardNumStr.trim().split(" ").filter(n => !!n.trim()).map(Number)

    const matching = winningNumbers.filter(num => cardNumbers.includes(num))
    scratchcards[cardIndex] = (scratchcards[cardIndex] || 0) + 1

    for (let i = 1; i <= matching.length; i++) {
      scratchcards[cardIndex + i] = (scratchcards[cardIndex + i] || 0) + scratchcards[cardIndex]
    }

    return scratchcards
  }, {})

  const totalCount = Object.values(totalScratchcards).reduce((sum, cards) => sum + cards, 0)

  console.log(`Part II: Total scratchcards = ${totalCount}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
