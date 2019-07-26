// # Moch
// providing a Mock class for create fake data to feed our test database
// base on stuff entity collecitons (staff - email staff )
// we need create object in both collection
// and clean up database after test

import Model from './Datastore'
import faker from 'faker'
import crypto from 'crypto'
import Moment from 'moment'

const staff = new Model('test_staffs')
const staffEmail = new Model('test_staff_emails')

class Mock {
  constructor (status, createdAt, expiresAt, verifiedAt) {
    this.ID = faker.random.uuid()
    this.password = faker.internet.password()
    this.email = faker.internet.email().toLowerCase()
    this.status = status
    this.createdAt = createdAt
    this.code = faker.random.uuid()
    this.expiresAt = expiresAt
    this.verifiedAt = verifiedAt
  }
  generate = () => {
    return {
      staffDocID: this.ID,
      staffDoc: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        gender: 1,
        status: this.status || 'new',
        mobile: '092345855332',
        email: this.email,
        createdAt: this.createdAt || Moment().format(),
        dob: '1987-04-12'
      },
      staffEmailDocID: this.email,
      staffEmailDoc: {
        staffId: this.ID,
        password: this.createPassword(this.password),
        verification: {
          code: this.code,
          expiresAt: this.expiresAt || Moment().add(1, 'days').format(),
          verifiedAt: null
        }
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
