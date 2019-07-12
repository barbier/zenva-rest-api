import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { secret, auth } from '../../config/passport'
import User from '../../models/User'

const router = Router()

router.get('/', auth, (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send({ err })
        
        return res.status(201).send(users)
    })
})

router.post('/', (req, res) => {
    const { username, password, } = req.body

    if (!username || !password) return res.status(400).send({
        req: `Required Fields not found:
        ${!username ? 'username' : ''}
        ${!password ? 'password' : ''}`,
    })
    const newUser = new User({ username, password, })
    newUser.save((err, model) => {
        if (err) return res.status(400).send({ err })
        
        return res.status(201).send(model)
    })
})
	
router.post('/token', (req, res) => {
    const { username, password, } = req.body
    if (!username || !password) {
    return res.status(400)
        .send({
            err: `Required Fields not found: ${!username ? 'username' : ''} ${!password ? 'password' : ''}`,
        })
    }
    User.findOne({ username, }, (err, userModel) => {
        if (err) return res.status(400).send(err)
 
        if (!userModel) return res.status(400).send({ err: 'Cannot find user' })
        
        return userModel.comparePassword(password, function(err, isMatch) {
            if (err) return res.status(400).send(err)
            
            if (!isMatch) {
                return res.status(401).send({ err: 'invalid password' })
            }

            const payload = { id: userModel._id }
            const token = jwt.sign(payload, secret)
            return res.send(token)
        })
    })
})

router.get('/current', auth, (req, res) => {
    return res.send(req.user)
})

export default router