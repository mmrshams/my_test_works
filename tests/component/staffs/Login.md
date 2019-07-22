
```javascript
/* eslint-disable handle-callback-err */
/* eslint-disable no-undef */
/* eslint-disable mocha/valid-suite-description */
```
testing base on  end-point cluster  =>   /v1/staffs/login  
testing all state of resposibility that can happens 

```javascript
import chai from 'chai'
import chaiHttp from 'chai-http'
import staff from '../../services/Staff'
import Config from '../../Config'
var assert = chai.assert
chai.use(chaiHttp)
const server = Config.config.server.host + ':' + Config.config.server.port
describe('Staff Entity', () => {
  
 // Test the /POST Login route
  
  describe('/POST  Login', () => {
    beforeEach(function () {
      return [staff.createStaff(), staff.createStaffEmail()]
    })
    it('01 response should have property firstname lastname email gmail gender dob mobile', done => {
      var CLIENT = {
        email: 'main_test@gmail.com',
        password: '12345678'
      }
      chai
        .request(server)
        .post('/v1/staffs/login')
        .set('apikey', Config.config.apiKey)
        .send(CLIENT)
        .end((err, res) => {
          assert.hasAllKeys(res.body.data.staff, ['firstName', 'lastName', 'email', 'gender', 'dob', 'createdAt', 'id', 'mobile', 'status', 'updatedAt', 'lastLogin'])
          done()
        })
    })
  })
})
```
