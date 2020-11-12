// public/loader.js
// utility script for loading results using API

const storyUrl = 'http://localhost:3000/api/story'

const loadStory = async function() {
  let response = await fetch(storyUrl)
  let story = await response.text()
  return story
}

const showStory = async function() {
  let placeHolder = document.querySelector('#story')
  let story = await loadStory()
  placeHolder.innerHTML = story
}

showStory()