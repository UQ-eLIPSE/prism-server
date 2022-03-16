**Prism**

This README should contain details on how to configure the server of the Prism Site.

_Techstack_

- MongoDB - DB of choice
- Express - HTTP Router of choice
- Manta - Object Storage of choice

## List of files to configure

- .env (use .env.ANLB.sample or .env.kingston.sample or .env.urban_water.sample as a reference)

  - Use Conf.ts to act as a guide if .env.\*.sample is not up to date
  - DATABASE_URL - The location where MongoDB is (e.g. 'mongodb://localhost:27017/andrew-liveris')
  - PORT_NUM - The port to host the application (e.g. port 8000)
  - USE_SENTRY - Set to false to disable (useful for dev mode). Otherwise true for production.
  - SENTRY_DSN - See the Sentry site for the value of the DSN to be used.
  - TMP_FOLDER - Where the tmp folder is located (i.e. C:\Users\...\prism\tmp)
  - JWT_Hash - JWT salt hash
  - USE_SSO - Set to false for local development
  - MANTA_HOST_NAME - The location where Manta should be hosted. E.g. https://stluc.manta.uqcloud.net
  - MANTA_KEY_FILE - Where the public/private keys are to authenticate self to Manta i.e. in C://.ssh/id_rsa or C:\.ssh\id_rsa (PLEASE NOTE: you will need to create this file if it does not exist - private key found on LastPass).
  - MANTA_KEY_ID - The id of the key. E.g. SHA256:Some_Hashed_String
  - MANTA_SUB_USER - The subuser associated with the keys. Generally empty
  - MANTA_ROLES - The roles the user would have on Manta. Generally an empty array
  - MANTA_USER - The username associated with the Manta keys
  - MANTA_ROOT_FOLDER - Where the public folder is located on Manta. E.g. public/user_name/files

- .env-development (use .env.ANLB.sample as a reference)
  - Use Conf.ts to act as a guide if .env.urban_water.sample is not up to date
  - DATABASE_URL - The location where MongoDB is (e.g. 'mongodb://mongodb:27017/andrew-liveris')
  - PORT_NUM - The port to host the application (e.g. port 8000)
  - USE_SENTRY - Set to false to disable (useful for dev mode). Otherwise true for production.
  - SENTRY_DSN - See the Sentry site for the value of the DSN to be used.

## Running

cd prism/server
cp .env.ANLB.sample .env

### Running Locally

yarn && yarn watch

### Running on Zone

yarn && yarn build
