// models/trie.js
// Author: Sergey Frolov, 2020

// TrieNode class for use in Dictionary

function TrieNode() {
  this.word = null    // word end indicator
  this.children = {}  // branches
  this.count = 0      // word count
  this.nodes = 0      // node count
}

TrieNode.prototype.insert = function(word) {
  let node = this
  for (let letter of word) {
    if (!node.children[letter]) {
      node.children[letter] = new TrieNode()
      this.nodes += 1
    }
    node = node.children[letter]
  }
  node.word = word
  this.count += 1
}

TrieNode.prototype.toString = function() {
  let result = ''
  if (this.word) {
    result += this.word + '\n'
  }
  for (let letter in this.children) {
    result += this.children[letter].toString()
  }
  return result
}

module.exports = TrieNode