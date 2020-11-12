// public/loader.js
// utility script for loading results using API

const storyUrl = 'http://localhost:3000/api/story'
const spellCheckUrl = 'http://localhost:3000/api/spellcheck'
const content = document.querySelector('#content')

const loadStory = async function() {
  let response = await fetch(storyUrl)
  let story = await response.text()
  return story
}

const loadSpellCheck = async function() {
  let response = await fetch(spellCheckUrl)
  let story = await response.json()
  return story
}

const showStory = async function() {
  let story = await loadStory()
  content.innerHTML = story
}

const showSpellCheck = async function() {
  let results = await loadSpellCheck()
  let html = '<ul>'
  for (let result in results) {
    html += `<li>${result} : best match = ${results[result][0]}</li>`
  }
  html += '</ul>'
  content.innerHTML = html
}

showSpellCheck()