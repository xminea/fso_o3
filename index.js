/* eslint-disable no-unused-vars */
const express = require('express')
const app = express()
require('dotenv').config()

const morgan = require('morgan')
const Contact = require('./models/person')

const cors = require('cors')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('body', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(
  morgan(':method :url :status :response-time ms - :res[content-length] :body')
)

app.get('/api/persons', (req, res) => {
  Contact.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/info', async (req, res) => {
  const date = new Date
  const dateText = date.toString()
  const count = await Contact.find({})
  res.send(
    `<div>Phonebook has info for ${count.length} people</div>
  <div>${dateText}</div>`
  )
})

app.get('/api/persons/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Contact.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Contact({
    name: body.name,
    number: body.number
  })

  person.save()
    .then(savedContact => {
      response.json(savedContact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Contact.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedContact => {
      response.json(updatedContact.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const port = process.env.PORT

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})