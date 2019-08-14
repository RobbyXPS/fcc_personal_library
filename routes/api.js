/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var Book = require('../schema/book.js')
require('dotenv').config();

const mongoose = require('mongoose')
const CONNECTION_STRING = process.env.DB;

mongoose.connect(process.env.DB || 3000)

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res) {
      // get the list of all books and send it back as an array of objects
      Book.find({}, function (err, docs) {
        res.json(docs);
      })
    })

    .post(function (req, res) {
      // get the title from the front-end form
      var title = req.body.title;
      
      // if the title is not supplied then send an error (only possible via tests)
      if (title == undefined) {
        res.send('Book title is required.');
      } 
      // if it does have a title create and save the book
      else {
        const new_book = new Book({
          title: title,
          commentcount: 0
        })  
        new_book.save()
        res.json(new_book)
      }
    })
    
    .delete(function(req, res) {
      // find all book documents and delete them all
      Book.deleteMany({}, function (err) {
        if (err) return err;
        res.send('complete delete successful')
      })
    });

  app.route('/api/books/:id')
    .get(function (req, res) {
      // get the id from the front-end form
      var bookid = req.params.id;
      // if the title is not supplied then send an error (only possible via tests)
      if (bookid == undefined) {
        res.send('Book id is required.')
      } 
      // if it does have a title create and save the book
      else {
        // find the document and create a new object to send back that only has the keys we want
        Book.findById(bookid, function (err, item) {
          if (item == undefined) {
            res.send('no book exists')
          } else {
              var res_obj = (({ _id, title, comments }) => ({ _id, title, comments }))(item); 
              res.json(res_obj)  
          }
        })
      }
    })
    
    .post(function(req, res){
    
      var bookid = req.params.id;
      var comment = req.body.comment; 
    
      if (bookid == undefined) {
        res.send('Book id is required.')
      }
      else {
        // find the document and create a new object to send back that only has the keys we want
        Book.findById(bookid, function (err, item) {
          if (item == undefined) {
            res.send('no book exists')
          } else {
            item.comments.push(comment)
            item.commentcount = item.commentcount + 1;
            item.save()
            var res_obj = (({ _id, title, comments }) => ({ _id, title, comments }))(item); 
            res.json(res_obj)  
          }        
        });
      }
    })
    
    .delete(function(req, res){
      var bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.deleteOne({ _id: bookid }, function (err) {
        if (err) return err;
        res.send('delete successful')
      });
  });
};