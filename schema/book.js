var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var bookSchema = new Schema({
    title:  String,
    commentcount: Number,
    comments: [String]
  });

var Book = mongoose.model('book', bookSchema);
module.exports = Book;