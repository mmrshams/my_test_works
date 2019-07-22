
import Config from '../Config'
import Firestore from '@google-cloud/firestore'

// set new data to document.
let items = {
  identifier: 'mmrshams96@gmial.com',
  collection: 'firestore-data-storage',
  data: {
    firstname: 'omid',
    lastname: 'shams'
  }
}
// firestore configuration
const firestore = new Firestore({
  projectId: Config.config.firestore.projectId,
  keyFilename: Config.config.firestore.keyFilename
})

// there is the class of crud for working with firestore
class Datastore {
  // initialize data in constructor that incloud  data,collection,indentifer(optional),batchSize for deleting documents
  constructor (collection, data, identifier) {
    this.data = data
    this.collection = collection
    this.identifier = identifier
    this.batchSize = 10
  }

  async setDocument (item) {
    try {
      const document = firestore.collection(this.collection).doc()
      await document.set(this.data)
      console.log('Entered new data into the document')
    } catch (e) {
      console.log('error', e)
    }
  }
  async setDocumentWithID (item) {
    try {
      const document = firestore.collection(this.collection).doc(this.identifier)
      await document.set(this.data)
      console.log('Entered new data into the document with identifier ')
    } catch (e) {
      console.log('error', e)
    }
  }

  // Update an existing document.
  async updateDocument () {
    try {
      const document = firestore.doc('')
      await document.update({
      })
      console.log('Updated an existing document')
    } catch (e) {
      console.log('error', e)
    }
  }

  // Delete the document.
  async deleteDocument (ID) {
    try {
      const document = firestore.collection(this.collection).doc(ID)
      await document.delete()
      console.log('Deleted the document')
    } catch (e) {
      console.log('error', e)
    }
  }
  // delete collection dependecies
  async deleteQueryBatch (collection, batchSize) {
    const snapshot = await collection.get()
    if (snapshot.size > 0) {
      let batch = firestore.batch()
      snapshot.docs.forEach(doc => { batch.delete(doc.ref) })
      await batch.commit()
      console.log('collection deleted !')
    }
    if (snapshot.size >= batchSize) {
      return this.deleteQueryBatch(collection, batchSize)
    }
  }
  // Delete collection.
  deleteCollection () {
    let collectionRef = firestore.collection(this.collection)
    var collection = collectionRef.limit(this.batchSize)
    return this.deleteQueryBatch(collection, this.batchSize)
  }

  // reference list of documents
  async listDocumemt () {
    try {
      const document = firestore.collection().doc()
      let doc = await document.get()
      console.log('list of Documents', doc)
    } catch (e) {
      console.log('error', e)
    }
  }
}

let testOne = new Datastore(items.collection, items.data)
testOne.deleteCollection()
module.exports = { Datastore }
