const contactModel = require('../models/contact-model')

async function showContacts(req, res) {
  const contacts = await contactModel.getAllContacts()
  res.render('contacts', { contacts })
}

async function createContact(req, res) {
  try {
    await contactModel.createContact(req.body)
    res.redirect('/contacts')
  } catch (err) {
    console.error(err)
    res.send('Error al crear contacto')
  }
}

module.exports = { showContacts, createContact }
