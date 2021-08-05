const express = require('express');
const router = express.Router();
const heroModel = require('../model/heros')
const { findHero } = require('./utils')



//routes get

router.get('/heroes', async (req, res) => {
    try {
        const heroes = await heroModel.find()
        res.json(heroes)
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'Griiii' })
    }
})


router.get('/heroes/:name', async (req, res) => {
    try {
        const nameHero = req.params.name
        const heroOne = await findHero(nameHero)

        if (heroOne) {
            res.json({ heroOne })
        } else {
            res.json({ message: 'Hero not found' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'There was a problem' })
    }
})


router.get('/heroes/:name/powers', async (req, res) => {
    try {
        const nameHero = req.params.name
        const heroPow = await findHero(nameHero)

        if (heroPow) {
            res.json({ power: heroPow.power })
        } else {
            res.json({ message: 'Hero not found' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'There was a problem' })
    }
})


// routes post

router.post('/heroes', async (req, res) => {
    const heroData = req.body
    const newHero = new heroModel(heroData)
    try {
        const heroName = await newHero.save()
        res.json({ success: true, payload: heroName })
    }
    catch (err) {
        if (err.code === 11000) {
            res.json({ success: false, payload: 'Hero exists' })
        } else {
            res.json({ success: false, payload: err })
        }
    }
})

router.post('/heroes/:name/powers', async (req, res) => {
    try {
        const nameHero = req.params.name
        const hero = await findHero(nameHero)
        console.log(hero)
        if (hero) {
            const heroPower = req.body.power
            hero.power.push(heroPower)

            await hero.save()
            res.json({ message: 'Ok, hero power was added!' })
        } else {
            res.status(400).json({ errorMessage: 'Hero was not found' })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'There was a problem' })
    }
})

router.delete('/heroes/:name', async (req, res) => {
    try {
        const nameHero = req.params.name
        await heroModel.deleteOne({
            name: {
                $regex: new RegExp('^' + nameHero, 'i'),
            },
        })
        res.json({ message: `Hero ${nameHero} deleted ` })
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'There was a problem' })
    }
})


router.delete('/heroes/:name/powers/:power', async (req, res) => {
    try {
        const nameHero = req.params.name
        const heroPower = req.params.power
        const hero = await findHero(nameHero)
        const indexPower = hero.power.findIndex(elem => {
            return elem.toLowerCase() === heroPower.toLowerCase()
        })
        if (indexPower > -1) {
            await heroModel.updateOne({ name: hero.name }, { $pull: { power: heroPower } })
            res.json({ message: `The power ${heroPower} of ${nameHero} was deleted` })
        } else {
            res.status(400).json({ message: `The power ${heroPower} doesn't exists for ${nameHero}` })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ errorMessage: 'There was a problem' })
    }

})


// route 404

router.get('*', (req, res) => {
    res.json({ errorMessage: 'Page Not Found 404' }, 404)
})

module.exports = router
