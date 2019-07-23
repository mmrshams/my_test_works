// # Model
// Providing a model class to work with Firestore data storage.
// It's primary goal is to check creation of data for cleanup at the of tests.

// ## Why only creation?
// As we are doing blackbox testing, we should not know the logic of API and no
// need to check the existence of data after API calls.
// We only need to seed the database with some data before we call APIs for our tests.
// Basically this is our **seeder library**.

import configs from '../configs'
import Firestore from '@google-cloud/firestore'

const firestore = new Firestore(configs.firestore)

class Model {
  constructor (collection) {
    this.collection = firestore.collection(collection)
    this.batchSize = 10
  }

  async setDocumentWithID (key, obj) {
    try {
      const document = this.collection.doc(key)
      await document.set(obj)
      console.log('Entered new data into the document with identifier ')
    } catch (e) {
      console.log('error', e)
    }
  }

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

  deleteCollection () {
    let collectionRef = this.collection
    var collection = collectionRef.limit(this.batchSize)
    return this.deleteQueryBatch(collection, this.batchSize)
  }
}

export default Model
