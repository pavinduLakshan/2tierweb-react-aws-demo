import React, { useState } from 'react';
import {Auth} from "aws-amplify"
import { v4 as uuidv4 } from 'uuid';
import AWS from "aws-sdk"

const AddOrUpdateBook = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const bookIdToBeUpdated = searchParams.get("id")
    const [bookName,setBookName] = useState()
    const [authorName,setAuthorName] = useState()
    const [price,setPrice] = useState()

    async function addOrUpdateBook(e){
        e.preventDefault()
        const userInfo = await Auth.currentUserInfo()
        if (userInfo == null){
            alert("You first need to log in.")
            return
        }
        const credentials = await Auth.currentUserCredentials()
        const docClient = new AWS.DynamoDB.DocumentClient({credentials});

        if(bookIdToBeUpdated){
            let updateExpression = "set"
            const ean = {}
            const eav = {}

            if(bookName){
                updateExpression += " #a = :x"
                ean["#a"] = "name"
                eav[":x"] = bookName
            }
            if(authorName){
                updateExpression += ", #b = :y"
                ean["#b"] = "author"
                eav[":y"] = authorName
            }
            if(price){
                updateExpression += ", #c = :z"
                ean["#c"] = "price"
                eav[":z"] = price
            }

            var params = {
                TableName: process.env.REACT_APP_dynamodbTableName,
                Key: { 
                    pk : userInfo.id, 
                    sk: "BOOK#"+bookIdToBeUpdated 
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeNames: ean,
                ExpressionAttributeValues: eav
              };
              
              docClient.update(params, function(err, data) {
                 if (err) console.log(err);
                 else console.log(data);
              });
        } else {
            const params = {
                TableName : process.env.REACT_APP_dynamodbTableName,
                Item: {
                   pk: userInfo.id,
                   sk:"BOOK#" + uuidv4(),
                   name: bookName,
                   type: "BOOK",
                   author: authorName,
                   price:price
                }
              };

               docClient.put(params, function(err, data) {
                if (err) console.log(err);
                else console.log(data);
              });
        }
    }

    return (
        <div>
            <form onSubmit={addOrUpdateBook}>
                <label>Book name</label>
                <input type="text" name="book_name" onChange={e => setBookName(e.target.value)}></input>
                
                <label>Author name</label>
                <input type="text" name="author_name" onChange={e => setAuthorName(e.target.value)}></input>
                
                <label>Price</label>
                <input type="text" name="price" onChange={e => setPrice(e.target.value)}></input>
                <button type="submit">
                    BOOK
                    {/* {  isUpdate ? "Update Book" : "Add book"} */}
                </button>
            </form>            
        </div>
    );
};

export default AddOrUpdateBook;