const express = require('express')
const app = express()
const readData = require('./utils/file')
const Dictionary = require('./models/dictionary')
const SearchEngine = require('./models/search')

app.use(express.static('public'))

// Variables:
let storyFile = 'data/story.txt'
let dictionaryFile = 'data/dictionary.txt'
let dictionary = new Dictionary()
let searchEngine = new SearchEngine()
let story = ''
let spellcheckResults = {}

const process = async function() {
  // Read text files
  let [dictionaryText, storyText] = await readData(dictionaryFile, storyFile)
  story = storyText
      .replace(/[,.!?]/g,'') // remove punctuation
      .toLocaleLowerCase() // assume a case-insensitive scenario
  dictionary.fromText(dictionaryText) // create a new dictionary

  // Update search engine and create a list of matches
  searchEngine.update(dictionary)
  console.log(`${dictionary.trie.count} words were loaded to the dictionary.`)
  spellcheckResults = searchEngine.searchAll(story, 1)
  console.log(spellcheckResults)
}

process()

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