# Information Security and Quality Assurance Projects - Personal Library

### _User stories_

1. Nothing from my website will be cached in my client as a security measure.
2. I will see that the site is powered by 'PHP 4.2.0' even though it isn't as a security measure.
3. I can post a title to /api/books to add a book and returned will be the object with the title and a unique _id.
4. I can get /api/books to retrieve an aray of all books containing title, _id, & commentcount.
5. I can get /api/books/{_id} to retrieve a single object of a book containing title, _id, & an array of comments (empty array if no comments present).
6. I can post a comment to /api/books/{_id} to add a comment to a book and returned will be the books object similar to get /api/books/{_id}.
7. I can delete /api/books/{_id} to delete a book from the collection. Returned will be 'delete successful' if successful.
8. If I try to request a book that doesn't exist I will get a 'no book exists' message.
9. I can send a delete request to /api/books to delete all books in the database. Returned will be 'complete delete successful' if successful.
10. All 6 functional tests required are complete and passing.

#### Companion app to test with
- https://pricey-hugger.glitch.me/

  <br>
  ----------------------------------------------------------------------------------------
  <br>

### _Technology and how it was used_

#### Security features (Helmet JS)
    WHAT: NO CACHE
        - HOW: Prevents browser from caching via header setting.
            - WHY: Prevents users from getting cached versions of your files (like old JavaScript). For example if one of your libraries has a vulnerablitiy that you want to make sure the user gets the latest version you updated to.
    WHAT: HIDE POWERED BY
        - HOW: Changes the x-powered-by header displayed in network traffic.
            - WHY: Makes it slightly harder for attackers to see what potentially-vulnerable technology powers your site. For example you can set it to php instead of node.

#### Back-End features (Node + Express)
    - CRUD endpoints to handle book data.
    
#### Front-End features (HTML + AJAX + Bootstrap)
    - Front-End > Back-End communication via AJAX requests for dynamic data generation.
    - Responsive design via HTML and mobile first Bootstrap library. 
    
#### Database (Mongo + Mongoose)
    - MongoDB managed in the cloud via https://www.mongodb.com/cloud.
    - Mongoose ODM (Object Document Mapper) used to make DB interactions more graceful. 
    
#### Test (Chai)
    - Basic API tests written with Chai testing framework.
    
#### Notes:
  
  .env file is not included in repo, need to add with below code.

  `DB=SECRETKEY_URI_DB`  
  `NODE_ENV=notest`