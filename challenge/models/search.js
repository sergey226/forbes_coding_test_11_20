// models/search.js
// Author: Sergey Frolov, 2020

// SearchEngine class for searching closely matched words in a dictionary.
// Match between two words is determined using Levenshtein's distance (or cost).
// The smaller is the distance, the closer is the match.

function SearchEngine(dictionary = null) {
  this.update(dictionary)
}

SearchEngine.prototype.update = function(dictionary) {
  this.dictionary = dictionary
}

SearchEngine.prototype.search = function(word, cost) {
  // Main search function for calculating the Levenshtein distance
  // and collecting words from the dictionary with distances
  // smaller or equal than te "cost" argument

  let result = {
    found: false,
    matches: []
  }
  if (!this.dictionary) return result
  let trie = this.dictionary.trie

  // Maximum Levenshtein distance/cost possible
  if (!cost) cost = word.length 

  // Use a prefix table to determine the Levenshtein cost for each word
  // Initialize 1st row:
  let row = new Array(word.length+1).fill(0).map((v,i)=>i)
  
  // Continue the recursive trie search to find all matches
  for (let letter in trie.children) {
    this.recursiveSearch(
        trie.children[letter], letter, word, row, result, cost)
        if (result.found) break;
  }

  if (result.found) result.matches = []
  else result.matches.sort((a,b)=>a[1]-b[1])

  return result
}

SearchEngine.prototype.recursiveSearch = function(
    node, letter, word, previousRow, result, cost) {
  // Recursive portion of the search algorithm, which
  // uses the DFS traversal along the dictionary trie

  let currentRow = [previousRow[0]+1]
  let currentCost;
  for (let i=1; i<=word.length; ++i) {
    if (word[i-1] === letter) {
      currentCost = previousRow[i-1]
    } else {
      currentCost = Math.min(previousRow[i]+1,
          currentRow[i-1]+1, previousRow[i-1]+1)
    }
    currentRow.push(currentCost)
  }

  // Check if it's a matching word:
  if (node.word && currentCost<= cost) {
    result.matches.push([node.word, currentCost])
    if (currentCost === 0) result.found = true
  }

  // Check if some row cells below cost:
  if (!result.found && Math.min(...currentRow) <= cost) {
    for (let letter in node.children) {
      this.recursiveSearch(
        node.children[letter], letter, word, currentRow, result, cost)
    }
  }
}

SearchEngine.prototype.searchAll = function(text, maxMatches = 3) {
  // Finds and returns possible matches for misspelled words in a text
  // maxMatches limits the number of returned matches

  let words = text.trim().split(/\s+/)
  let results = {}
  let maxCost = 3   // max Levenshtein distance considered
  for (let word of words) {
    let result = this.search(word, maxCost)
    if (!result.found) {
      results[word] = result.matches.slice(0, maxMatches).map(v=>v[0])
    }
  }
  return results
}

module.exports = SearchEngine