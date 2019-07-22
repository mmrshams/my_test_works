/*
Staff.js

this file have some function to instial data for our test that need  references

 createStaff () => create new staff base on staff object
 deleteStaff (ID) => delete speical staff with ID
 cleanStaff () => delete staffs colleciton that we had some documnets on it

 */

import Datastore from './Datastore'
let staffCollection = 'dev_staffs'
let emialStaffCollection = 'dev_staff_emails'

let staff = {
  createdAt: '2019-07-20T17:16:56+04:30',
  dob: '1987-03-23',
  email: 'main_test@gmail.com',
  firstName: 'omid',
  gender: 1,
  id: '173670d5-3a3c-4bed-b672-aca4db81c937',
  lastName: 'shams',
  mobile: '0923458558',
  status: 'new',
  updatedAt: '2019-07-20T17:16:56+04:30'
}

let emailStaff = {
  createdAt: '2019-07-20T17:16:56+04:30',
  id: 'main_test@gmail.com',
  password: '54d5bbc97f0497686e260beae7e456b9673763f26c348799e6d9f61883866922.80ebabbb7ec0ab9a32eff7c29da611e334dac4d4fa7f5eb58eff048acf4815cb',
  staffId: '173670d5-3a3c-4bed-b672-aca4db81c937',
  updatedAt: '2019-07-20T17:16:56+04:30',
  verification:
    {
      code: 'b140b855-9688-42a5-9e45-79200bb67355',
      expiresAt: '2019-08-03T17:16:56+04:30',
      verifiedAt: null

    }
}
const ClassStaff = new Datastore.Datastore(staffCollection, staff, staff.id)

function createStaff () {
  return ClassStaff.setDocumentWithID()
}

function deleteStaff (ID) {
  return ClassStaff.deleteDocument(ID)
}

function cleanStaff () {
  return ClassStaff.deleteCollection()
}

// create class instance for email-staff collection
const ClassEmailStaffS = new Datastore.Datastore(emialStaffCollection, emailStaff, staff.email)

function createStaffEmail () {
  return ClassEmailStaffS.setDocumentWithID()
}
function deleteStaffEmail (ID) {
  return ClassEmailStaffS.deleteDocument(ID)
}
function cleanStaffEmail () {
  return ClassStaff.deleteCollection()
}
// deleteStaff('173670d5-3a3c-4bed-b672-aca4db81c937')
// deleteStaffEmail('main_test@gmail.com')
module.exports = { createStaff, deleteStaff, cleanStaff, createStaffEmail, deleteStaffEmail, cleanStaffEmail }
