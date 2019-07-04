import { Schema } from 'mongoose'
import mongoose from '../database/mongodb'
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        index: {
            unique: true,
        },
    },
    password: {
        type: String,
        required: true,
    },
})

const updatePassword = (user, next) => {
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err)

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err)

            user.password = hash
            next()
        })
    })
}

userSchema.pre('save', function(next) {
    updatePassword(this, next)
})

userSchema.methods.comparePassword = (password, next) => {
    bcrypt.compare(password, this.password, (err, isMatch) => {
        if (err) return next(err)

        return next(null, isMatch)
    })
}

export default mongoose.model('user', userSchema)