const express = require('express')
const app = express()
const cors = require('cors')
const { promises: fs } = require("fs")

app.use(cors())

// Variables and constants:
const storyFile = 'data/story.txt'
const dictionaryFile = 'data/dictionary.txt'
let story = ''
let dictionary = ''

const readFile = async fileName => {
  let file = null
  try {
    file = await fs.readFile(fileName, "utf-8")
  } catch (e) {
      console.log("File reading error", e)
  }
  return file
}

readFile(storyFile).then(result => {
  story = result
  console.log(result.slice(0,20))
})

readFile(dictionaryFile).then(result => {
  dictionary = result
  console.log(result.slice(0,20))
})

function createPage() {
  return '<h1>TESTING 1 2 3!!!!</h1>'
}

app.get('/', (request, response) => {
  const page = createPage()
  response.send(page)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})