$( document ).ready(function() {
  // array used to hold html that will be constructed later
  var items = [];
  // array to hold jquery object sent back from api
  var itemsRaw = [];

  $.getJSON('/api/books', function(data) {    
    // BOOK LIST CONSTRUCTION
    // raw jquery object with all data from api
    itemsRaw = data;
    // iterate through each element returned from the api
    $.each(data, function(i, val) {
      // construct list item in html from api data
      items.push(`
        <li class="list-group-item bookItem" id="${i}">
          <button type="button" class="list-group-item list-group-item-action" data-toggle="list">
            ${val.title}
          <span class="badge badge-dark badge-pill">${val.commentcount} comments</span>
          </button>
        </li>
      `)
      // jquery .each function breaks when you return false. We only want a list of 15 books.
      return ( i !== 14 );
    });
    // if there is more then 15 books add some text to the bottom of the list to let the user know there are more
    if (items.length >= 15) {
      items.push('<p>...and '+ (data.length - 15)+' more!</p>');
    }
    // create the list container and add it to the main html 'book-list' element
    $('<ul/>', {
      'class': 'listWrapper list-group',
      html: items.join('')
      }).appendTo('#book-list');
  })
  // BOOK DETAIL CONSTRUCTION
  // comments array to hold html
  var comments =[];
  // when the user selects a book from the list, create a detail element to show them the comments and give them options to choose from
  $('#book-list').on('click', 'li.bookItem', function() {
    // update card title
    $('#detailTitle').html(`
      <b>${itemsRaw[this.id].title}</b> (id: ${itemsRaw[this.id]._id})
    `)
    // update card list of comments via api request
    $.getJSON(`/api/books/${itemsRaw[this.id]._id}`, function(data) {
      // the api returns an array of comments, iterate through each and create html list items for them
      $.each(data.comments, function(i, val) {
        comments.push(`<li class="list-group-item">${i+1}. ${val}</li>`)
      });
      // update the main html once the list from the api has been iterated over
      $('#detailComments').html(comments.join(''));
      // clear array for the next time a list item is selected
      comments = [];
      // after getting the id's from the api add the input & button to add a comment, also the button to delete the book
      let detail_options_elements = (`
        <form class="mx-auto" id="newCommentForm">

          <div class="input-group mb-3">
            <input id="commentToAdd" type="text" class="form-control" name="comment"  placeholder="New Comment" aria-label="New Comment" aria-describedby="basic-addon2">
            <div class="input-group-append">
              <button id="${data._id}" class="btn btn-success addComment" type="button">Add</button>
            </div>
          </div>
        </form>  
        <button id="${data._id}" class="btn btn-danger deleteBook mx-auto">Delete Book</button>
      `);
      // add the options to the main html
      $('#detailOptions').html(detail_options_elements);
      // if the UI is in mobile view then scroll down to the detail section
      if (document.body.clientWidth < 768) {
        $('html, body').animate({
          scrollTop: ($('#bookDetail').offset().top)
        },500);
      }
    });
  });
  
  // when the user selects to delete a single book delete it from the db
  $('#bookDetail').on('click','button.deleteBook',function() {
    $.ajax({
      url: '/api/books/'+this.id,
      type: 'delete',
      success: function(data) {
        // reload the page after deleting the book
        location.reload();
      }
    });
  });  
  
  // when the user selects to add a comment to a single book add the comment to the db
  $('#bookDetail').on('click','button.addComment',function() {
    // get the string from the form input
    var newComment = $('#commentToAdd').val();
    $.ajax({
      url: `/api/books/${this.id}`,
      type: 'post',
      dataType: 'json',
      data: $('#newCommentForm').serialize(),
      success: function(data) {
        // construct the li element with a number before the comment string
        let new_comment = (`<li class="list-group-item">${data.comments.length}. ${newComment}</li>`)
        // clear the field so the user can add another comment if they want
        $("#commentToAdd").val('');
        // update the main html with the new comment
        $( new_comment ).appendTo( $( "#detailComments:last" ) );
      }
    });
  });
  
  // api handler for when a user adds a new book to the list
  $('#newBook').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'post',
      dataType: 'json',
      data: $('#newBookForm').serialize(),
      success: function(data) {
        // couldn't get reload to work here so it's in the index scripts
      }
    });
  });

  // api handler for when a user deletes all the books in the db
  $('#deleteAllBooks').click(function() {
    $.ajax({
      url: '/api/books',
      type: 'delete',
      dataType: 'json',
      success: function(data) {
        // couldn't get reload to work here so it's in the index scripts
      }
    });
  }); 
  

  // responsive UI so that desktop is more horizontal and mobile is more vertical
  var responsive_ui = function() {
    // mobile view
    if (document.body.clientWidth < 768) {
      $('#list-detail-container').removeClass( "flex-row" ).addClass( "flex-column" );
    // desktop view  
    } else if (document.body.clientWidth >= 768) {
      $('#list-detail-container').removeClass( "flex-column" ).addClass( "flex-row" );
      $('#rule-middle').css('margin', '0px')
    };
  };
  
  // trigger the function when the window size changes
  $(window).resize(function(){
    responsive_ui();
  });
  
  // trigger the function when the page first loads
  responsive_ui();
});