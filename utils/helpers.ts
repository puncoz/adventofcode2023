import { readFile, stat } from "fs"

export const isFileExists = (filename: string): Promise<boolean> => new Promise((resolve, reject) => {
  stat(filename, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve(true)
    }
  })
})

export const readInputFile = (fileDir: string, isTest: boolean = false, testCase: number = 1): any => new Promise((resolve, reject) => {
  const file = `${fileDir}/${isTest ? `test-${testCase}` : "input"}`

  readFile(file, { encoding: "utf-8" }, (err, data) => {
    if (err) {
      reject(err)
    } else {
      resolve(data)
    }
  })
})

export const benchmark = async <T>(title: string, cb: (...p: any[]) => Promise<any>, params: any[] = []): Promise<T> => {
  console.time(title)
  const result = await cb(...params)
  console.timeEnd(title)

  return result
}
