const heroModel = require('../model/heros')


const findHero = async (name) => {
    try {
        return await heroModel.findOne({ name: { $regex: new RegExp('^' + name, 'i') } })
    } catch (err) {
        console.error(err)
        return null
    }
}


  


module.exports = { findHero}