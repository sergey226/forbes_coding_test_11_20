// index.js
// Author: Sergey Frolov, 2020

const express = require('express')
const app = express()
const readData = require('./utils/file')
const Dictionary = require('./models/dictionary')
const SearchEngine = require('./models/search')
const open = require('open')

app.use(express.static('public'))

// Variables and constants
let storyFile = 'data/story.txt'
let dictionaryFile = 'data/dictionary.txt'
let dictionary = new Dictionary()
let searchEngine = new SearchEngine()
let story = ''
let spellcheckResults = {}
const port = 3000

// Primary function
const processData = async function() {
  // Read text files
  let [dictionaryText, storyText] = await readData(dictionaryFile, storyFile)
  story = storyText
      .replace(/[,.!?]/g,'')          // remove punctuation
      .toLocaleLowerCase()            // assume a case-insensitive scenario
  dictionary.fromText(dictionaryText) // create a new dictionary

  // Update search engine and create a list of matches
  searchEngine.update(dictionary)
  console.log(`${dictionary.trie.count} words were loaded to the dictionary.`)
  spellcheckResults = searchEngine.searchAll(story, 1)
  console.log(spellcheckResults)

  // Open a browser window 
  await open(`http://localhost:${port}`, 'google chrome')
}

// Set up routes (only one - spellcheck - is required)
app.get('/api/story', (request, response) => {
  response.send(story)
})

app.get('/api/dictionary', (request, response) => {
  response.json(dictionary)
})

app.get('/api/spellcheck', (request, response) => {
  response.json(spellcheckResults)
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Make it so:
processData()