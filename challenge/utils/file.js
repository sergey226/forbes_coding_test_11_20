// utils/file.js

// Collection of file loading utility functions
const { promises: fs } = require('fs')

async function readFile(fileName) {
  let file = null
  try {
    file = await fs.readFile(fileName, "utf-8")
  } catch (e) {
      console.log("File reading error", e)
  } 
  return file
}

async function readData(dictionaryFile, storyFile) {
  const readDictionary = await readFile(dictionaryFile)
  const readStory = await readFile(storyFile)
  return [readDictionary, readStory]
}

module.exports = readData