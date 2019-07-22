
```javascript

```
Datastore.js
this file will have interaction with our test's database  (CREATE - CREATE ID - UPDATE - DELETE-DOCUMENT - DELETE-COLLECTION - LIST)

```javascript
import Config from '../Config'
import Firestore from '@google-cloud/firestore'
```
set new data to document.

```javascript
let items = {
  identifier: 'mmrshams96@gmial.com',
  collection: 'firestore-data-storage',
  data: {
    firstname: 'omid',
    lastname: 'shams'
  }
}
```
firestore configuration

```javascript
const firestore = new Firestore({
  projectId: Config.config.firestore.projectId,
  keyFilename: Config.config.firestore.keyFilename
})
```
there is the class of crud for working with firestore

```javascript
class Datastore {
  // initialize data in constructor that incloud  data,collection,indentifer(optional),batchSize for deleting documents
  constructor (collection, data, identifier) {
    this.data = data
    this.collection = collection
    this.identifier = identifier
    this.batchSize = 10
  }
```
setDocument() => set document to collection + default ID

```javascript
  async setDocument () {
    try {
      const document = firestore.collection(this.collection).doc()
      await document.set(this.data)
      console.log('Entered new data into the document')
    } catch (e) {
      console.log('error', e)
    }
  }
  // setDocumentWithID() => set document to collection + manual ID
  async setDocumentWithID () {
    try {
      const document = firestore.collection(this.collection).doc(this.identifier)
      await document.set(this.data)
      console.log('Entered new data into the document with identifier ')
    } catch (e) {
      console.log('error', e)
    }
  }
```
updateDocument () => update document data in special collection

```javascript
  async updateDocument () {
    try {
      const document = firestore.collection(this.collection).doc('')
      await document.update({
      })
      console.log('Updated an existing document')
    } catch (e) {
      console.log('error', e)
    }
  }


  //deleteCollection () => delete special document with ID
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
  //  deleteCollection () => delete special collection and depend on [deleteQueryBatch()]
  deleteCollection () {
    let collectionRef = firestore.collection(this.collection)
    var collection = collectionRef.limit(this.batchSize)
    return this.deleteQueryBatch(collection, this.batchSize)
  }
```
listDocumemt() => will Return list of document

```javascript
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
```
