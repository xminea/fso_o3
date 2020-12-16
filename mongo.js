const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstack:${password}@cluster0.1823b.mongodb.net/Phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', personSchema)

if (process.argv.length === 3) {
    console.log('phonebook:')
    Contact.find({}).then(result => {
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const person = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    person.save().then(response => {
        console.log('person saved!')
        mongoose.connection.close()
      })

}
 /*

const person = new Person({
  content: 'settei',
  date: new Date(),
  important: true,
})
 
note.save().then(response => {
  console.log('note saved!')
  mongoose.connection.close()
})


Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})
*/
