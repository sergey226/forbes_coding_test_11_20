// public/loader.js
// Author: Sergey Frolov, 2020

// utility js script for loading results using localhost API

// Constants
const baseUrl = 'http://localhost:3000'
const storyUrl = `${baseUrl}/api/story`
const spellCheckUrl = `${baseUrl}/api/spellcheck`
const content = document.querySelector('#content')

// extra functions - not required for the task
const loadStory = async function() {
  let response = await fetch(storyUrl)
  let story = await response.text()
  return story
}

const showStory = async function() {
  let story = await loadStory()
  content.innerHTML = story
}

// main functions
const loadSpellCheck = async function() {
  let response = await fetch(spellCheckUrl)
  let story = await response.json()
  return story
}

const showSpellCheck = async function() {
  let results = await loadSpellCheck()
  content.innerHTML = `<table><tr>
      <th>Original</th>
      <th>Suggested</th>
      </tr>
      ${table(results)}
      </table>`
}

const table = function(results) {
  let rows = []
  for (let result in results) {
    rows.push(template(result, results))
  }
  return rows.join('');
}

const template = function(result, results) {
  return `<tr><td>${result}</td><td>${results[result][0]}</td></tr>`
}

showSpellCheck()