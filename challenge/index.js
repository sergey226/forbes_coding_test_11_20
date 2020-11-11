const express = require('express')
const app = express()

const createPage = () => {
  return '<h1>TESTING 1 2 3!!!!</h1>'
}

app.get('/', (request, response) => {
  const page = createPage()
  response.send(page)
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})