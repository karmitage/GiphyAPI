$(document).ready(function () {

  // Initialize an array to hold moods
  var moods = ["sad", "angry", "happy", "over it", "excited"];
  //initialize array to hold gifs
  var gifDiv = $("<div>");

  // Button render function
  function renderButtons() {
    //empty buttons
    $("#buttons-view").empty();

    // Looping through the array & generate buttons
    for (var i = 0; i < moods.length; i++) {
      var a = $("<button>");
      // Adding a class
      a.addClass("mood");
      // Adding a data-attribute 
      a.attr("data-name", moods[i]);
      // Providing the button's text with a value of the movie at index i
      a.text(moods[i]);
      // Adding the button to the HTML
      $("#buttons-view").append(a);
    }
  }

  // This function allows the user to add a button
  $("#add-mood").on("click", function (event) {
    event.preventDefault();
    // Grab the text from the input box
    var mood = $("#mood-input").val().trim();
    //if the user entered text, create a new button
    if (mood !== '') {
      // Add the input text to the array
      moods.push(mood);
      // call the renderButtons function to display buttons for each item in the array
      renderButtons();
    }
    console.log("hello");

  });

  //add an event listener to each button that will display ten related giphys
  //add listener to the body (specifying the class) so that it will work with dynamically
  //created elements

  $("body").on("click", ".mood", function () {

    console.log("hi");

    var giphyQuery = $(this).attr("data-name");

    // Constructing a URL to search Giphy for the name of the person who said the quote
    var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
      giphyQuery + "&api_key=cRF5C7JAbdEgY22Puz9KENtm5REmonEX&limit=10&lang=en";

    // Performing our AJAX GET request
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      // After the data comes back from the API
      .then(function (response) {
        // Storing an array of results in the results variable
        var results = response.data;
        //clear gifDiv
        gifDiv.empty();

        // Looping over every result item
        for (var i = 0; i < results.length; i++) {

          // Only taking action if the photo has an appropriate rating
          if (results[i].rating !== "r" && results[i].rating !== "pg-13") {

            // Storing the result item's rating
            var rating = results[i].rating;

            // Creating a paragraph tag with the result item's rating
            var p = $("<p>").text("Rating: " + rating);

            // Creating an image tag
            var moodImage = $("<img>");

            // Giving the image tag an src attribute of a proprty pulled off the
            // result item
            moodImage.attr("src", results[i].images.fixed_height.url);

            //add attributes for still and animated gif versions
            moodImage.attr("data-still", results[i].images.fixed_height_still.url);
            moodImage.attr("data-animate", results[i].images.fixed_height.url);
            moodImage.attr("data-state", "animate");
            //add giphy class (we will use this for the on click element)
            moodImage.addClass("giphy");

            // Appending the paragraph and personImage we created to the "gifDiv" div we created
            gifDiv.append(p);
            gifDiv.append(moodImage);

            //append 'still' and 'animate' attributes to the gifDiv

            // Prepending the gifDiv to the "#gifs-appear-here" div in the HTML
            $("#gifs").prepend(gifDiv);

          }
        }
      });

  });

  //on click function for dynamically generated giphy elements that allows the user 
  //to pause the gifs

  $("body").on("click", ".giphy", function () {
    //grab current state
    var state = $(this).attr("data-state");

    if (state === "still") {
      $(this).attr("src", $(this).attr("data-animate"));
      $(this).attr("data-state", "animate");
    } else {
      $(this).attr("src", $(this).attr("data-still"));
      $(this).attr("data-state", "still");
    }

  });

  // Calling the renderButtons function at least once to display the initial list of moods
  renderButtons();

});