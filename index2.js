const express = require('express');
const express_graphql = require('express-graphql');

const {
    buildSchema
} = require('graphql');

let schema = buildSchema(`
type Query {
    book(id : Int!): Book
    books(genres : String): [Book]
},
type Mutation {
    updateBookGenres(id: Int!, genres: String!): Book
},
type Book {
    id: Int
    title: String
    author: String
    description: String
    genres: String
}
`);

const booksData = [{
        id: 1,
        title: 'The Complete Node.js Developer',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        genres: 'Education'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        genres: 'Education'
    },
    {
        id: 3,
        title: 'Brave New World',
        author: 'Aldous Huxleya',
        description: 'ABrave New World is a dystopian novel written in 1931 by English author Aldous Huxley, and published in 1932.',
        genres: 'Science Fiction'
    }
]
let getBook = (args) => {
    let id = args.id;
    return booksData.filter(book => {
        return book.id == id
    })[0];
}
let getBooks = (args) => {
    if (args.topic) {
        let topic = args.topic;
        return booksData.filter(book => {
            book.topic == topic
        });
    } else {
        return booksData;
    }
}
let updateBookGenres = ({
    id,
    genres
}) => {
    booksData.map(book => {
        if (book.id === id) {
            book.genres = genres;
            return book;
        }
    });
    return booksData.filter(book => book.id === id)[0];
}
let root = {
    book: getBook,
    books: getBooks,
    updateBookGenres: updateBookGenres
};
let app = express();

app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => {
    console.log(`working on port 4000`)
});


// Using Aliases & Fragments

// 1.
// query getSingleBook($bookID: Int!) {
//     book(id: $bookID) {
//       title
//       author
//       description
//       genres
//     }
//   }

// query variables:  
// { "bookID": 1}

// 2. 
// query getBookWithFragments($bookID1: Int!, $bookID2: Int!) {
//     book1: book(id: $bookID1) {
//            ...bookFields
//     },
//     book2: book(id: $bookID2) {
//           ...bookFields
//     } 
// }
// fragment bookFields on Book {
// title
// author
// description
// genres
// }

// query variables:  
// {"bookID1":1,"bookID2":3 }


// Creating And Using Mutations 

//1.
// mutation updateCourseTopic($id: Int!, $genres: String!) {
//     updateBookGenres(id: $id, genres: $genres) {
//       ... bookFields
//     }
//   }
//   fragment bookFields on Book {
//     title
//     author
//     description
//     genres
//   }

// query variables: 
// { "id": 3,"genres": "Noval"}