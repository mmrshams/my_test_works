
// test configuration and setup environment variables
require('dotenv').config({ path: './config.test' })
const config = {}
const {
  NODE_ENV, STAFFS_SERVER_PORT, FIRESTORE_PROJECT_ID, FIRESTORE_KEY_FILE_NAME, HOST_SERVER, PROPERTY_STAFFS_API_KEY
} = process.env
config.environment = NODE_ENV || 'test'
config.envShortName = 'test'
config.apiKey = PROPERTY_STAFFS_API_KEY || 'b30002fe-e1a8-4dfd-b9df-c1cce6d957ce'
config.server = { host: HOST_SERVER || 'localhost', port: STAFFS_SERVER_PORT || 4100 }
config.firestore = {}
config.firestore.projectId = FIRESTORE_PROJECT_ID || 'tipi-development'
config.firestore.keyFilename = FIRESTORE_KEY_FILE_NAME || './misc/credentials/gcp/tipi-development-owner.json'

module.exports = { config }