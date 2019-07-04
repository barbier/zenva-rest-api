import { Router } from 'express'
import User from '../../models/User'

const router = Router()

router.get('/', (req, res) => {
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
	
router.post('/password', (req, res) => {
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
        
        return userModel.comparePassword(password, (err, isMatch) => {
            if (err) return res.status(400).send(err)
            
            return res.send({ correct: isMatch, })
        })
    })
})

export default router