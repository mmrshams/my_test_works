import Datastore from './Datastore'

let collection = 'staff-storage'
let staff = {

  firstName: 'omid',
  lastName: 'shams',
  email: 'test-one3@gmail.com',
  password: '12345678',
  gender: 1,
  dob: '1987-03-23',
  mobile: '0923458558'
}

const StaffStorage = new Datastore.Datastore(collection, staff)

function createStaff () {
  return StaffStorage.setDocument()
}

function deleteStaff (ID) {
  return StaffStorage.deleteDocument(ID)
}

function cleanStaff () {
  return StaffStorage.deleteCollection()
}
// createStaff()
deleteStaff('F3GV0Jal7fS3iVH9Vtr2')

module.exports = { createStaff, deleteStaff, cleanStaff }
