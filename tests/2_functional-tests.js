/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {

  suite('Routing tests', function() {

    // var used for update tests
    var _id1;
    
    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({title: 'super cool book title'})
          .end(function(err, res) {  
            assert.equal(res.status, 200);
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.property(res.body, 'comments', 'Book should contain comments');
            assert.isArray(res.body.comments, 'Comments should be an array');
            assert.equal(res.body.title, 'super cool book title');
            // assign an id to the var that you know exists to use for later tests
            _id1 = res.body._id;
            done();
        });
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
          .post('/api/books')
          .send({})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'Book title is required.');
            done();
        });
      });
    });

    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
          .get('/api/books')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, 'response should be an array of objects');
            assert.property(res.body[0], 'commentcount', 'each object should have a commentcount key');
            assert.property(res.body[0], 'title', 'each object should have a title key');
            assert.property(res.body[0], '_id', 'each object should have an id key');
            done();
        });
      });      
    });

    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        chai.request(server)
          .get('/api/books/noidwouldbethisthingyo')
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.text, 'no book exists');
            done();
        });
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
          chai.request(server)
          .get('/api/books/'+_id1)
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments, 'property should be an array of comments');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
            assert.equal(res.body._id, _id1);
            done();
        });
      });
    });

    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        chai.request(server)
          .post('/api/books/'+_id1)
          .send({comment: 'my crazy test comment'})
          .end(function(err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.comments);
            assert.include(res.body.comments, 'my crazy test comment');
            assert.property(res.body, 'comments');
            assert.property(res.body, 'title');
            assert.property(res.body, '_id');
          done();
        });
      });
    });
  });
});