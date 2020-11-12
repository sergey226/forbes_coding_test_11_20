const express = require('express')
const app = express()
const cors = require('cors')
const { promises: fs } = require('fs')
const Dictionary = require('./models/dictionary')
const SearchEngine = require('./models/search')

app.use(cors())
app.use(express.static('public'))

// Variables and constants:
const storyFile = 'data/story.txt'
const dictionaryFile = 'data/dictionary.txt'
let dictionary = new Dictionary()
let searchEngine = new SearchEngine()
let story = ''
let spellcheckResults = {}

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
})

readFile(dictionaryFile).then(result => {
  dictionary.fromText(result)
  searchEngine.update(dictionary)
  console.log(`${dictionary.trie.count} words were loaded to the dictionary.`)
  spellcheckResults = searchEngine.searchAll(story, 1)
  console.log(spellcheckResults)
})


app.get('/api/story', (request, response) => {
  response.send(story)
})

app.get('/api/dictionary', (request, response) => {
  response.json(dictionary)
})

app.get('/api/spellcheck', (request, response) => {
  response.json(spellcheckResults)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})