/* eslint-disable no-unused-vars */
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */

//testing base on  end-point cluster  =>   /v1/staffs  
//testing all state of resposibility that can happens
import chai from 'chai'
import chaiHttp from 'chai-http'
import Service from '../Services.js'
let should = chai.should()
var assert = chai.assert
chai.use(chaiHttp)

describe('Staff Entity', () => {
  
  // Test the /POST SignUp route
  
  describe('/POST  SignUp', () => {
    afterEach(function () {
      return Service.listDocumemt()
    })
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
        .request(Service.Server)
        .post('/v1/staffs')
        .set('apikey', Service.validApiKey)
        .send(CLIENT)
        .end((err, res) => {
          Service.listDocumemt()
          assert.hasAllKeys(res.body.data, ['firstName', 'lastName', 'email', 'gender', 'dob', 'createdAt', 'id', 'mobile', 'status', 'updatedAt'])
          done()
        })
    })
  })
})
