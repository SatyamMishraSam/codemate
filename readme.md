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

- while deplyoing to product we have to manually mention all the secreats there

` AWS SES SETUP` - for sending mails

- create iam user - ses-user-codemate
- attach sesfullaccess policy

- Go to Amazon SES
- Create identity with domain name
- Map the CNAME to our DNS (cloudflare)
- Get setup page and request for the production access
- create secret access key for the created iam user
- paste the access key to env file

- V3 Nodejs Setup
- Install AWS SDK V3
- Code Example - https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_ses_code_examples.html

- Github Example - https://github.com/awsdocs/aws-doc-sdk-examples/tree/main/javascriptv3/example_code/ses#code-examples

- go to this repo of sending email example
- it has dependency as first create sesclient so we also have to do `npm i @aws-sdk/client-ses`

# configure sesclient

- add this in the sesClient.js where we have to provide the access key details
  credentials: {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET,
  },

- https://github.com/awsdocs/aws-doc-sdk-examples/blob/main/javascriptv3/example_code/ses/src/ses_sendemail.js#L16

- this is the reference file for the sending email code which is in sendEmail.js
- with run method we can run after saving the connection requirement
- we can make run funcation dynamic and sendEmail function also

- passing the toUser email id in run function and we can send email to those users also

`Razorpay Setup`

- Setup of razorpay account
- create an instacnce of razorpay (configuring the Razorpay ) as utils/razorpay.js
- Mention the key and secret key

- Creation of schema for the payment details storage
- with help of instance will create the order and push to DB
- make api dynamic type membership type and amount, for that we can create a constants file for plantype and amount

- Now we have got the popup of payment with run method
- Now we have to call the webhook - > setting - webhook
  https://codemate.online/api/payment/webhook - as

<!-- Verify webhook and signature -->

- https://razorpay.com/docs/webhooks/validate-test/#validate-webhooks

- this is the webhook response we get
  https://razorpay.com/docs/webhooks/payloads/payments/#payment-authorized

  `SOcket.io`

- npm i socket.io
- setup of socket.io
  - require http module and create server with that=> http.createSever
  - replace the port listen to this server
  - create an io with socket() function(require socket from socket.io)and also pass first arg as sever and second as the cors config
  - with io.on method create multiple event handlers where first param as connection and then second as multiple events
