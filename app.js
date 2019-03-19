// nodemon app.js

var bodyParser = require('body-parser');
var jsonfile = require('jsonfile');
var express = require('express');
var app = express();

const file = `${__dirname}\\data.json`;

// extract the entire body portion of an incoming request stream and exposes it on req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

//FIND OUT WHAT THIS REALLY IS!
app.use(function (req, res, next) {
    "use strict";
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

// GET ALL CATEGORIES
app.get('/category/all', (req, res) => {
    jsonfile.readFile(file)
    .then((categories) => {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(categories));
    })
    .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
    });
})

// GET CATEGORY BY ID
app.get('/category/', (req, res) => {
    const id = req.query.id;
    const limit = req.query.limit;
    const above = req.query.above;

    if (id) {
        jsonfile.readFile(file)
        .then((categories) => {
            const response = categories.filter(category => category.id == id);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        })
        .catch((error) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end(error);
        })
    } else if (limit) {
        if (above === 'true') {
            jsonfile.readFile(file)
            .then((categories) => {
                const response = categories.filter((category) => category.budget > limit);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            })
            .catch((error) => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(error);
            });
        } else {
            jsonfile.readFile(file)
            .then((categories) => {
                const response = categories.filter((category) => category.budget < limit);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            })
            .catch((error) => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end(error);
            });
        }
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Reading server side JSON file failed.\n" + "No ID supplied in query.");
    }
})

// ADD A NEW CATEGORY
app.post('/category', (req, res) => {
    jsonfile.readFile(file)
    .then((categories) => {
        let existingCategory = '';
        existingCategory = categories.find(category => category.id == req.body.id);

        if (existingCategory) {
            res.writeHead(409, { 'Content-Type': 'text/plain' });
            res.end('A resource with corresponding ID already exists!');
            return false;
        }

        const id = req.body.id;
        const name = req.body.name;
        const budget = req.body.budget;
        const newItem = { id, name, budget };

        categories.push(newItem);

        jsonfile.writeFile(file, categories, { spaces: 2})
        .then(() => {
            console.log(categories);
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end(JSON.stringify(categories));
        })
        .catch((error) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end();
        });
    })
    .catch((error) => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end();
    });
});

// DELETE A CATEGORY
app.delete('/category', (req, res) => {
    const id = req.query.id;
    if (id) {
        jsonfile.readFile(file)
        .then((categories) => {
            const newState = categories.filter((category) => category.id != id);
            jsonfile.writeFile(file, newState, { spaces: 2 })
            .then(() => {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(JSON.stringify(newState));
            })
            .catch((error) => {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end();
            })
        })
        .catch((error) => {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end();
        })
    } else {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end("Reading server side JSON file failed.\n" + "No ID supplied in query.");
    }
});

// listen port 3001 for connections
app.listen(3001);
