
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */
import chai from 'chai'
import chaiHttp from 'chai-http'
import Config from '../../configs'
var assert = chai.assert
chai.use(chaiHttp)
const server = Config.config.server.host + ':' + Config.config.server.port
describe('Staff Entity', () => {
  /*
  * Test the /POST SignUp route
  */
  describe('/POST  SignUp', () => {
    it('01 response should have property firstname lastname email gmail gender dob mobile', done => {
      var CLIENT = {
        firstName: 'omid',
        lastName: 'shams',
        email: 'main_test@gmail.com',
        password: '12345678',
        gender: 1,
        dob: '1987-03-23',
        mobile: '0923458558'
      }
      chai
        .request(server)
        .post('/v1/staffs')
        .set('apikey', Config.config.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          Service.listDocumemt()
          assert.hasAllKeys(res.body.data, ['firstName', 'lastName', 'email', 'gender', 'dob', 'createdAt', 'id', 'mobile', 'status', 'updatedAt'])
          done()
        })
    })
  })
})
