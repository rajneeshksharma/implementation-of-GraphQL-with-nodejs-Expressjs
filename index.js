const express = require('express');
const express_graphql = require('express-graphql');

const { buildSchema } = require('graphql');
// GraphQL schema
let schema = buildSchema(`type Query { message : String}`);
// Root resolver
let root = {
    message : () => 'Hello Rajneesh'
};
let app = express();
app.use('/graphql', express_graphql({
    schema : schema,
    rootValue : root,
    graphiql : true
}));
app.listen(4000, ()=>{console.log(`running on localhost:4000/graphql `)});