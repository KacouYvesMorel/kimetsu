var express = require ('express');
var {graphqlHTTP} = require ('express-graphql');
var {buildSchema} = require ('graphql');
var kimetsu = require ('./data/kimetsuAll');
var cors = require ('cors');
var bodyParser = require ('body-parser');
const port = process.env.PORT || 4000;


var schema = buildSchema (`
 type kimetsu{
    description:String
    link:String
    download:String
  }
  type Query {
    hello: String
    Kimetsu:[kimetsu!]!
    personnage(description:String!):[kimetsu!]!
  }
`);

var root = {
  hello: () => 'Hello world!',
  Kimetsu: () => kimetsu,
  personnage: ({description}) => {
    let data = [];
    kimetsu.map (personnage => {
      if (personnage.description === description.toLowerCase ()) {
        data.push (personnage);
      }
    });
    return data;
  },
};

var app = express ();
app.use (cors ()).use (bodyParser.json ()).use (
  '/graphql',
  graphqlHTTP ({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen (port, () => console.log ('Now browse to localhost'+port));
