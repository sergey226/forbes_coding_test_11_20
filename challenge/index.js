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
  let res = searchEngine.searchAll(story.slice(0,50))
  console.log(res)
})


app.get('/api/story', (request, response) => {
  response.send(story)
})

app.get('/api/dictionary', (request, response) => {
  response.json(dictionary)
})

app.get('/api/spellcheck', (request, response) => {
  response.json({})
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})