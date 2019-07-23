import Model from './Datastore'
import faker from 'faker'
import crypto from 'crypto'
const staff = new Model('test_staffs')
const staffEmail = new Model('test_staff_emails')

class Mock {
  constructor () {
    this.email = faker.internet.email().toLowerCase()
    this.ID = faker.random.uuid()
    this.password = faker.internet.password()
  }
  generate = () => {
    return {
      staffDocID: this.ID,
      staffDoc: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        // dob: faker.date.past(),
        // createdAt: faker.date.recent(),
        // mobile: faker.phone.phoneNumber(),
        // status: 'new',
        email: this.email
        // gender: faker.random.boolean()
      },
      staffEmailDocID: this.email,
      staffEmailDoc: {
        staffId: this.ID,
        password: this.createPassword(this.password),
        // createdAt: faker.date.recent(),
        // updatedAt: faker.date.recent(),
        verification:
        {
          // expiresAt: faker.date.future(),
          code: faker.internet.password(),
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
