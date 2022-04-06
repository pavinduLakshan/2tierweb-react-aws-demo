import React, { useEffect, useState } from 'react';
import { Auth } from "aws-amplify"
import {Link} from "react-router-dom"
import AWS from "aws-sdk"

const Home = () => {
    const [isLogged,setIsLogged] = useState(false)
    const [allbooks,setAllBooks] = useState([])
    const [mybooks,setMyBooks] = useState([])

    const [myBooksFetchError,setMyBooksFetchError] = useState("")
    const [allBooksFetchError,setAllBooksFetchError] = useState("")

    useEffect(async () => {
      try{
        await Auth.currentSession()
        setIsLogged(true)
    } catch (err){
        setIsLogged(false)
      }
  },[])

  useEffect(() => {
    getAllBooks()
    getMyBooks()
  },[])

  async function getMyBooks(){
    const userInfo = await Auth.currentUserInfo()
    const credentials = await Auth.currentUserCredentials()
    const docClient = new AWS.DynamoDB.DocumentClient({credentials});

    var params = {
      TableName : process.env.REACT_APP_dynamodbTableName,
      KeyConditionExpression: 'pk = :pk and begins_with(sk,:sk)',
      ExpressionAttributeValues: {
        ':pk': userInfo.id,
        ':sk': "BOOK"
      }
    };
    
    docClient.query(params, function(err, data) {
      if (err) console.log(err);
      else setMyBooks(data.Items);
   });
  }

  async function logOut(){
    await Auth.signOut()
    setIsLogged(false)
  }

  async function getAllBooks(){
    const credentials = await Auth.currentUserCredentials()
    const docClient = new AWS.DynamoDB.DocumentClient({credentials});

    var params = {
      TableName : process.env.REACT_APP_dynamodbTableName,
      IndexName: "type-index",
      KeyConditionExpression: '#typeName = :type',
      ExpressionAttributeNames: {
        "#typeName": "type"
      },
      ExpressionAttributeValues: {
        ':type': "BOOK"
      }
    };
    
    docClient.query(params, function(err, data) {
      if (err) {
        console.log(err);
        let errMsg = ""
        if (err.code === "AccessDeniedException"){
          errMsg = "Only admins can view all books"
        } else {
          errMsg = "Error when fetching all books"
        }
        setAllBooksFetchError(errMsg)
      }
      else {
        console.log(data)
        setAllBooks(data.Items);
      }
   });
  }

    return (
        <div>
            <Link to="/book">
            <button>Add book</button>
            </Link>
            {!isLogged ? (
            <>
            <Link to="/login">
            <button>Login</button>
            </Link>
            <Link to="/register">
            <button>Register</button>
            </Link>
            </>
            ) : <button onClick={logOut}>
                Logout
              </button>}
            <h2>Book App Demo</h2>

            <h3>All Books</h3>
            {allBooksFetchError}
            {isLogged ? allbooks.map((book,index) => {
               return (
                 <div key={index}>
                   <p>{book.name} by {book.author}</p>
                 </div>
               ) 
              }) : <p>Log in to see your books</p>}
            <h3>My Books</h3>
              {isLogged ? mybooks.map((book,index) => {
               return (
                 <div key={index}>
                   <p>{book.name} by {book.author}</p>
                 </div>
               ) 
              }) : <p>Log in to see your books</p>}
        </div>
    );
};

export default Home;