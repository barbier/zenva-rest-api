import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/jwtApi', { useNewUrlParser: true }, (err, data) => {
    if (err) {
        console.log(`Error: ${err}`)
        return
    }
    console.log('Connected to database')
})

export default mongoose