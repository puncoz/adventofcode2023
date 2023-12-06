import { benchmark, readInputFile } from "../utils/helpers"

const getMapValue = (needle: number, mapArr: number[][]): number => {
  for (let i = 0; i < mapArr.length; i++) {
    if (needle >= mapArr[i][1] && needle <= (mapArr[i][1] + mapArr[i][2])) {
      return mapArr[i][0] + (needle - mapArr[i][1])
    }
  }

  return needle
}

const _prepareAlmanac = (input: string[]) => {
  const data = {
    seeds: [],
    seedToSoil: [],
    soilToFertilizer: [],
    fertilizerToWater: [],
    waterToLight: [],
    lightToTemperature: [],
    temperatureToHumidity: [],
    humidityToLocation: [],
  }
  let mapPointer = {
    current: "",
    "seed-to-soil": "seedToSoil",
    "soil-to-fertilizer": "soilToFertilizer",
    "fertilizer-to-water": "fertilizerToWater",
    "water-to-light": "waterToLight",
    "light-to-temperature": "lightToTemperature",
    "temperature-to-humidity": "temperatureToHumidity",
    "humidity-to-location": "humidityToLocation",
  }

  input.forEach((inputLine, index) => {
    if (!inputLine.trim()) {
      return
    }

    if (index === 0) {
      const [_, seedStr] = inputLine.split(":")
      data.seeds = seedStr.trim().split(" ").map(Number)

      return
    }

    if (inputLine.includes("-")) {
      const [pointer] = inputLine.split(" ")
      mapPointer.current = mapPointer[pointer]

      return
    }

    data[mapPointer.current] = [
      ...(data[mapPointer.current] || []),
      inputLine.split(" ").map(Number),
    ]
  })

  return data
}

const getInput = async (isTest: boolean, testCase: number): Promise<string[]> => {
  const inputString: string = await readInputFile(__dirname, isTest, testCase)

  return inputString.split(/[\r\n]/).filter((cards: string) => !!cards).map(String)
}

const partOne = async (input: string[]) => {
  const almanac = _prepareAlmanac(input)

  const lowestLocation = almanac.seeds.reduce((min, seed) => {
    const soil = getMapValue(seed, almanac.seedToSoil)
    const fertilizer = getMapValue(soil, almanac.soilToFertilizer)
    const water = getMapValue(fertilizer, almanac.fertilizerToWater)
    const light = getMapValue(water, almanac.waterToLight)
    const temperature = getMapValue(light, almanac.lightToTemperature)
    const humidity = getMapValue(temperature, almanac.temperatureToHumidity)
    const location = getMapValue(humidity, almanac.humidityToLocation)

    return min === null ? location : Math.min(min, location)
  }, null)

  console.log(`Part I: Lowest location = ${lowestLocation}`)
}

const partTwo = async (input: string[]) => {
  const almanac = _prepareAlmanac(input)

  const seeds = []
  let lowest = null
  for (let i = 0; i < almanac.seeds.length; i += 2) {
    for (let j = 0; j < almanac.seeds[i + 1]; j++) {
      // seeds.push(almanac.seeds[i] + j)
      const seed = almanac.seeds[i] + j

      const soil = getMapValue(seed, almanac.seedToSoil)
      const fertilizer = getMapValue(soil, almanac.soilToFertilizer)
      const water = getMapValue(fertilizer, almanac.fertilizerToWater)
      const light = getMapValue(water, almanac.waterToLight)
      const temperature = getMapValue(light, almanac.lightToTemperature)
      const humidity = getMapValue(temperature, almanac.temperatureToHumidity)
      const location = getMapValue(humidity, almanac.humidityToLocation)
      console.log(seed, location)
      lowest = lowest === null ? location : Math.min(lowest, location)
    }
  }

  console.log(lowest)
  return

  const lowestLocation = seeds.reduce((min, seed) => {
    const soil = getMapValue(seed, almanac.seedToSoil)
    const fertilizer = getMapValue(soil, almanac.soilToFertilizer)
    const water = getMapValue(fertilizer, almanac.fertilizerToWater)
    const light = getMapValue(water, almanac.waterToLight)
    const temperature = getMapValue(light, almanac.lightToTemperature)
    const humidity = getMapValue(temperature, almanac.temperatureToHumidity)
    const location = getMapValue(humidity, almanac.humidityToLocation)
    console.log(seed, soil)
    return min === null ? location : Math.min(min, location)
  }, null)

  console.log(`Part II: Lowest location = ${lowestLocation}`)
}

export const solution = async (isTest: boolean, testCase: number) => {
  const input = await benchmark<string[]>("Input", getInput, [isTest, testCase])

  await benchmark("Part I", partOne, [input])
  await benchmark("Part II", partTwo, [input])
}
