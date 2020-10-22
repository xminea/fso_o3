const express = require('express')
const app = express()
app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number: "040-123456",
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number: "39-44-5323523",
    },
    {
      id: 3,
      name: "Dan Abramov",
      number: "12-43-234345",
    },
    {
      id: 4,
      name: "Mary Poppendick",
      number: "39-23-6423122",
    }
  ]
  app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/persons', (req, res) => {
    res.json(persons)
  })
 
  app.get('/info', (req, res) => {
    const date = new Date
    const dateText = date.toString()
    res.send(
    `<div>Phonebook has info for ${persons.length} people</div>
    <div>${dateText}</div>`
    )
  })
  
  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(persons => persons.id !== id)
  
    response.status(204).end()
  })

  function generateId(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({ 
        error: 'name or number missing' 
      })

    }
    
    if ((persons.map(person => person.name)).includes(body.name)) {
      return response.status(400).json({ 
        error: 'name already exists in phonebook' 
      })
    }

    const person = {      
      id: generateId(0, 1000),
      name: body.name,
      number: body.number
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })

  const port = 3001;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    })