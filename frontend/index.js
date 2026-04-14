const express = require('express')
const morgan = require('morgan')
const app = express();

app.use(express.json())

// 创建自定义的 Morgan token 来显示请求体
morgan.token('post-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

// 自定义格式，包含请求体数据
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})

let person = [
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


app.get('/', (request, response) => {
    response.send('<h1>Phonebook API</h1><p>Available endpoints:</p><ul><li>GET /api/persons - Get all persons</li><li>GET /api/persons/:id - Get person by ID</li><li>POST /api/persons - Create new person</li><li>DELETE /api/persons/:id - Delete person</li><li>GET /info - Get info</li></ul>')
})

app.get('/api/persons', (request, response) => {
    response.json(person)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<p>Phonebook has info for ${person.length} people</p><p>${date}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const personId = person.find(person => person.id === id)
    if (personId) {
        response.json(personId)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    person = person.filter(person => person.id !== id)
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }
    if (person.find(person => person.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const newPerson = {
        id: String(Math.floor(Math.random() * 1000000)),
        name: body.name,
        number: body.number
    }
    person = person.concat(newPerson)
    response.json(newPerson)
})