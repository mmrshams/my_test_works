#configs
all of our configuration informaiton that we need to setup invironment for test

```javascript
import Path from 'path'
import dotenv from 'dotenv'

dotenv.config({ path: Path.join(__dirname, '../config.test') })

const {
  NODE_ENV, STAFFS_SERVER_PORT, STAFFS_SERVER_HOST, STAFFS_SERVER_PROTOCOL, LOG_LEVEL,
  FIRESTORE_PROJECT_ID, FIRESTORE_KEY_FILE_NAME, PROPERTY_STAFFS_API_KEY
} = process.env

const configs = {
  logLevel: LOG_LEVEL,
  environment: NODE_ENV,
  apiKey: PROPERTY_STAFFS_API_KEY,
  server: {
    port: STAFFS_SERVER_PORT,
    host: STAFFS_SERVER_HOST || 'localhost',
    protocol: STAFFS_SERVER_PROTOCOL || 'http',
    base: null // calculative value: please check below for the value
  },
  firestore: {
    projectId: FIRESTORE_PROJECT_ID,
    keyFilename: FIRESTORE_KEY_FILE_NAME
  }
}
```
main server-address for test

```javascript
configs.server.base = `${configs.server.protocol}://${configs.server.host}:${configs.server.port}`

export default configs
```
