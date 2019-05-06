const admin = require('firebase-admin');
const serviceAccount = require(`${__dirname}\\firebase\\case2019k-firebase-adminsdk-1kfji-4fccf16ecd.json`);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://case2019k.firebaseio.com"
});

const express = require('express');
const app = express();
const cors = require('cors')

app.use(cors());

app.get('/auth', (req, res) => {
  let idToken;
  if (req.headers.token) idToken = req.headers.token;

    // idToken comes from the client app
  admin.auth().verifyIdToken(idToken)
  .then((decodedToken) => decodedToken.uid)
  .then((uid) => {
    admin.auth().getUser(uid) // get user info with the user id
    .then(user => {
      console.log(user);
      res.writeHead(200, { 'Content-Type': 'application/json' }); // respond with the user id email
      res.end(JSON.stringify(user.email));
    })
    .catch(error => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(error.message);
    });
  })
  .catch((error) => {
    // Handle error
    console.log(error.message);
    res.writeHead(401, { 'Content-Type': 'text/plain' });
    res.end(error.message);
  });
});

// listen port 3001 for connections
app.listen(3001);
