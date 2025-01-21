`Start`

- npm init
- npm i express
- if we install any packages with npm i then it adds that package to package.json file

`package.json vs package-lock.json` =>

- package.json have the track(version details) of the installed dependencies
- package-lock have the [exact] version of the all dependencies.

`Versions-`

- ^ => automatically upgrade our project to any version
- example - ^4.21.2 => upgrate automatically to 4.X.X

- if we dont use this(4.21.2) => our project will only work on 4.21.2 version

#########################################################################################################3

- Request handler - (req,res)=>{}

`All APIs`

[authRouter]

- POST /signup
- POST /login
- POST /logout

[profileRouter]

- GET /profile/view
- GET /profile/edit
- PATCH /profile/password

- Status - ignore, interested, accepted, rejected

[ConnectionRequestRouter]

- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId

- POST /request/review/accepted/:reqId
- POST /request/review/rejected/:reqId

[userRouter]

- GET /user/connections
- GET /user/requests
- GET /user/feed

`Logics for ignored and interested profiles`

/request/send/:status/:userId

Cases to be checked -

- status should be only ignored and interested
- what if toUserId doesnt exist (API level)
- if oneUser Sends a request to another user then user should not send back the request
- duplicate user requests (if 1->2 then 1 should not send the request(status - ignored or interseted) again)

- user should not send connection to itself(handled in schema defintion as schema method before saving the docs)
  OR we can test it at API level also

`env file`

- protecting all our creds
- creating .env file
- Place all the secrets into this file
- require("dotenv").config(); -- configure this at the top level of the app
