import { stat } from "fs"

export const isFileExists = (filename: string): Promise<boolean> => new Promise((resolve, reject) => {
  stat(filename, (err) => {
    if (err) {
      reject(err)
    } else {
      resolve(true)
    }
  })
})
