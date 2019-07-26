
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
// the generalMock reference-object can give 3 obejct as argument (status, createdAt, expiresAt)
const generalMock = new Mock()
const invitedMock = new Mock()
invitedMock.status = 'invited'

const trialExpiryDue = 7

describe('Staff login', () => {
  let request
  before(async () => {
    await generalMock.createStaff()
  })

  beforeEach(async () => {
    request = chai
      .request(configs.server.base)
      .post('/v1/staffs/login')
      .set('apikey', configs.apiKey)
  })

  after(async () => {
    await generalMock.cleanup()
  })
  context('With any email or password', () => {
    it('When user is not registered it should return error', async () => {
      const { body } = await request.send({
        email: 'mmrshams966@gmail.com',
        password: 'password'
      })
      expect(body.error.statusCode).to.equal(404)
    })
  })

  context('With correct email but wrong password', () => {
    it('When user exists should return error', async () => {
      const { body } = await request.send({
        email: generalMock.email,
        password: 'wrongPassword'
      })
      expect(body.error.statusCode).to.equal(401)
    })
  })

  context('With correct email and password', () => {
    it('When not verified but login within 7 days should return staff', async () => {
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password
      })
      expect(body.data.staff).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'gender', 'mobile', 'dob', 'status', 'lastLogin')
        .and.to.have.property('email', generalMock.email)
      expect(body.data.staff).to.have.property('lastLogin').that.is.afterMoment(Moment().subtract(1, 'minute').format())
    })

    it('When not verified for 7 days or more it should return error', async () => {
      generalMock.createdAt = Moment().subtract(trialExpiryDue, 'days').format()
      await generalMock.createStaff()
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password
      })
      generalMock.createdAt = Moment().format()
      expect(body.error.statusCode).to.equal(403)
    })

    it('When invited but doesn\'t exist it should return error', async () => {
      await invitedMock.createStaff()
      const { body } = await request.send({
        email: invitedMock.email,
        password: invitedMock.password
      })
      expect(body.error.statusCode).to.equal(404)
      expect(body.error.output.payload.message).to.equal('Staff is invited, but it\'s not registered')
    })
  })
  context('With correct email and password , invitedEmail and verificationCode fields', () => {
    before(async () => {
      await generalMock.createStaff()
      await invitedMock.createStaff()
    })

    it('When invitedEmail is not valid should return error ', async () => {
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password,
        invitedEmail: 'unvalid email',
        verificationCode: 'invitedemail password'
      })
      expect(body.error.statusCode).to.equal(400)
    })
    it('When invitedEmail is not exist should return "not allowed"', async () => {
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password,
        invitedEmail: 'mmrshams123@gmail.com',
        verificationCode: 'invitedemail password'
      })
      expect(body.data.mergeResult).to.have.property('merge').eql('notAllowed')
    })
    it('When invitedEmail is valid but password is incorrect  should return "not allowed"', async () => {
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password,
        invitedEmail: invitedMock.email,
        verificationCode: 'invitedemail password'
      })
      expect(body.data.mergeResult).to.have.property('merge').eql('notAllowed')
    })
    it('When invitedEmail and password both are valid but code is expired should return "not allowed"', async () => {
      invitedMock.expiresAt = Moment().subtract(1, 'days').format()
      await invitedMock.createStaff()
      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password,
        invitedEmail: invitedMock.email,
        verificationCode: invitedMock.code
      })
      expect(body.data.mergeResult).to.have.property('merge').eql('invitationResent')
    })
    it('When invitedEmail and password both are valid  should return "allowed"', async () => {
      invitedMock.expiresAt = Moment().add(1, 'days').format()
      await invitedMock.createStaff()

      const { body } = await request.send({
        email: generalMock.email,
        password: generalMock.password,
        invitedEmail: invitedMock.email,
        verificationCode: invitedMock.code
      })
      expect(body.data.mergeResult).to.have.property('merge').eql('allowed')
    })
  })
})
