// # Moch
// providing a Mock class for create fake data to feed our test database
// base on stuff entity collecitons (staff - email staff )
// we need create object in both collection
// and clean up database after test

import Model from './Datastore'
import faker from 'faker'
import crypto from 'crypto'
const staff = new Model('test_staffs')
const staffEmail = new Model('test_staff_emails')

class Mock {
  constructor (status) {
    this.status = status
    this.email = faker.internet.email().toLowerCase()
    this.ID = faker.random.uuid().toString()
    this.password = faker.internet.password()
  }
  generate = () => {
    return {
      staffDocID: this.ID,
      staffDoc: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: 1,
        status: this.status,
        mobile: '092345855332',
        email: this.email,
        createdAt: '2019-07-24T09:55:30+00:00',
        updatedAt: '2019-07-24T09:55:53+00:00'
      },
      staffEmailDocID: this.email,
      staffEmailDoc: {
        staffId: this.ID,
        password: this.createPassword(this.password)
      }
    }
  }
  createPassword = (password) => {
    const hash = crypto.createHash('sha256')
    const buf = crypto.randomBytes(32)
    const salt = buf.toString('hex')
    hash.update(password)
    hash.update(salt)
    const hashedPassword = `${hash.digest('hex')}.${salt}`
    return hashedPassword
  }

  createStaff = async () => {
    const user = this.generate()
    await staff.setDocumentWithID(user.staffDocID, user.staffDoc)
    await staffEmail.setDocumentWithID(user.staffEmailDocID, user.staffEmailDoc)
    return user
  }

  cleanup = async () => {
    await staff.deleteCollection()
    await staffEmail.deleteCollection()
  }
}

export default Mock
