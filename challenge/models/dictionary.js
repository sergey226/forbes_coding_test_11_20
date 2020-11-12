// models/dictionary.js module
// Author: Sergey Frolov, 2020

const Trie = require('../models/trie')

// Dictionary class with words saved in a trie

function Dictionary(words = []) {
  this.trie = new Trie()
  this.update(words)
}

Dictionary.prototype.update = function(words) {
  this.words = words
  for (let word of words) {
    this.trie.insert(word)
  }
}

Dictionary.prototype.fromText = function(text) {
  this.update(text.trim().split(/\s+/))
}

module.exports = Dictionary