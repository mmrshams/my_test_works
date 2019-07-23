
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */
import chai from 'chai'
import chaiHttp from 'chai-http'
import Mock from '../../services/Staff'
import configs from '../../configs'
// var assert = chai.assert
chai.use(chaiHttp)
const expect = chai.expect
const mock = new Mock()
describe('Staff Entity', () => {
  /*
  * Test the /POST Login route
  */
  describe('/POST  Login', () => {
    beforeEach(function () {
      return mock.createStaff()
    })
    afterEach(function () {
      return mock.cleanup()
    })
    it('01 response should have property firstname lastname email gmail gender dob mobile', done => {
      var CLIENT = {
        email: mock.email,
        password: mock.password
      }
      chai
        .request(configs.server.base)
        .post('/v1/staffs/login')
        .set('apikey', configs.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          expect(res.body.data.staff).to.have.all.keys('id', 'firstName', 'lastName', 'email', 'lastLogin', 'updatedAt')
          // assert.hasAllKeys(res.body.data.staff, ['firstName', 'lastName', 'email', 'gender', 'dob', 'createdAt', 'id', 'mobile', 'status', 'updatedAt', 'lastLogin'])
          done()
        })
    })
  })
})
