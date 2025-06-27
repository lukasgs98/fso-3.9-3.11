const express = require("express")
const morgan = require("morgan")
const cors = require("cors")

// CONFIGURE SERVER
const app = express()
const PORT = process.env.PORT || 3001

// CONFIGURE MIDDLEWARE
morgan.token("req-body", (req, res) => JSON.stringify(req.body))
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :req-body"))

let people = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

// FETCH ALL PEOPLE
app.get("/api/persons", (req, res) => {
  res.json(people)
})

// FETCH SPECIFIC PERSON
app.get("/api/persons/:id", (req, res) => {
  const person = people.find(person => person.id === req.params.id)
  if (person) {
    res.json(person)
  } else {
    res.statusMessage = "Person not found"
    res.status(404).end()
  }
})

// FETCH INFO
app.get("/api/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${people.length} people</p>
     <p>${new Date().toString()}</p>`
  )
})

// ADD NEW PERSON
app.post("/api/persons", (req, res) => {
  console.log(req.body)
  if (!req.body.name) {
    return res.status(400).json({"error": "no name provided"})
  } else if (!req.body.number) {
    return res.status(400).json({"error": "no number provided"})
  } else if (people.find(person => person.name === req.body.name)) {
    return res.status(400).json({"error": "names must be unique"})
  }

  const newID = () => {
    const maxId = people.length > 0
      ? Math.max(...people.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

  const person = {
    "id": newID(),
    "name": req.body.name,
    "number": req.body.number
  }

  people.push(person)
  res.status(200).json(person)
})

// DELETE PERSON
app.delete("/api/persons/:id", (req, res) => {
  const person = people.find(person => person.id === req.params.id)
  if (person) {
    people = people.filter(person => person.id !== req.params.id)
    res.statusMessage = "Person deleted"
    res.status(200).end()
  } else {
    res.statusMessage = "Person not found"
    res.status(404).end()
  }
})

app.listen(PORT, () => console.log("Server listening on port " + PORT))
