
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

// # login test
// there is the component test for all possible states that may happen in real call

import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'
import Moment from 'moment'
import chaiMoment from 'chai-moment'

chai.use(chaiHttp)
chai.use(chaiMoment)

const expect = chai.expect
// the mock reference-object can give 3 obejct as argument (status, createdAt, expiresAt)
const mock = new Mock()
const trialExpiryDue = 7

describe('Staff login', () => {
  let request
  before(async () => {
    await mock.createStaff()
  })

  beforeEach(async () => {
    request = chai
      .request(configs.server.base)
      .post('/v1/staffs/login')
      .set('apikey', configs.apiKey)
  })

  after(async () => {
    await mock.cleanup()
  })
  context('With any email or password', () => {
    it('When user is not registered it should return error', async () => {
      const { body } = await request.send({
        email: 'mmrshams96@gmail.com',
        password: 'password'
      })
      expect(body.error.statusCode).to.equal(404)
    })
  })

  context('With correct email but wrong password', () => {
    it('When user exists should return error', async () => {
      const { body } = await request.send({
        email: mock.email,
        password: 'wrongPassword'
      })
      expect(body.error.statusCode).to.equal(401)
    })
  })

  context('With correct email and password', () => {
    it('When not verified but login within 7 days should return staff', async () => {
      const { body } = await request.send({
        email: mock.email,
        password: mock.password
      })
      expect(body.data.staff).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status', 'lastLogin')
        .and.to.have.property('email', mock.email)
      expect(body.data.staff).to.have.property('lastLogin').that.is.afterMoment(Moment().subtract(1, 'minute').format())
    })

    it('When not verified for 7 days or more it should return error', async () => {
      mock.createdAt = Moment().subtract(trialExpiryDue, 'days').format()
      await mock.createStaff()
      const { body } = await request.send({
        email: mock.email,
        password: mock.password
      })
      expect(body.error.statusCode).to.equal(403)
    })

    it('When invited but doesn\'t exist it should return error', async () => {
      mock.status = 'invited'

      const { body } = await request.send({
        email: mock.email,
        password: mock.password
      })
      expect(body.error.statusCode).to.equal(404)
      expect(body.error.output.payload.message).to.equal('Staff is invited, but it\'s not registered')
    })

    it('When user exists but invited with another email address it should return merged staff', async () => {
      // TO DO
    })
  })
})
