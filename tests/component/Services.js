// import Config from '../Config'
const { Firestore } = require('@google-cloud/firestore')
// var CLIENT, Server, validationClient, validApiKey

// validApiKey = Config.config.apiKey
const firestore = new Firestore({
  projectId: 'tipi-development',
  keyFilename: './misc/credentials/gcp/tipi-development-owner.json'
})

// set new data to document.
async function setDocument () {
  const document = firestore.collection('dev_staffs').doc()
  await document.set({
    name: 'omid shams',
    body: 'tainja khosh amadi'
  })
  console.log('Entered new data into the document')
}

// Update an existing document.
async function updateDocument () {
  const document = firestore.doc('tipi-development')
  await document.update({
    body: 'My first Firestore app'
  })
  console.log('Updated an existing document')
}

// Delete the document.
async function deleteDocument () {
  const document = firestore.doc('-')
  await document.delete()
  console.log('Deleted the document')
}

// reference list of documents
async function listDocumemt () {
  const document = firestore.collection('dev_staffs').doc('0efab75b-27ab-43f8-b02d-9f9123a763ec')
  console.log(document)
  let doc = await document.get()
  console.log(doc)
}

setDocument()

// Server = Config.config.server.host + ':' + Config.config.server.port
//  validApiKey
module.exports = { listDocumemt, deleteDocument, updateDocument, setDocument }
