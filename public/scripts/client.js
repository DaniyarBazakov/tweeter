/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */


$(document).ready(function() {
  
  // Function to calculate the time since a given date
  const timeSince = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
  
    let interval = seconds / 31536000;
    if (interval > 1) {
      return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
      return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
      return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };
  
  // Function to validate tweet length
  const isTweetValid = function(text) {
    if (text <= 0) {
      showError("The textarea cannot be empty.");
      return false; 
    };

    if (text > 140) {
      showError("The textarea cannot exceed 140 characters. Please shorten your message.");
      return false; 
    };

    return true;
  }

  // Function to escape potentially unsafe characters in a string
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // Function to create a tweet element
  const createTweetElement = function(tweet) {
    const tweetDate = new Date(tweet.created_at);
    const formattedDate = timeSince(tweetDate);
    const sanitizedText = escape(tweet.content.text);
    const $tweet = $(`
      <article class="tweet">
        <header>
          <div class="logo-username">
            <img src="${tweet.user.avatars}" alt="Avatar" class="tweet-avatar">
            <h3>${tweet.user.name}</h3>
          </div>
          <h3 class="tweet-account">${tweet.user.handle}</h3>
        </header>
        <p class="tweet-text">${sanitizedText}</p>
        <footer>
          <time>${formattedDate}</time>
          <div class="footer-icons">
            <i class="fa-solid fa-flag"></i>
            <i class="fa-solid fa-retweet"></i>
            <i class="fa-solid fa-heart"></i>
          </div>
        </footer>
      </article>
    `);
    return $tweet;
  };

  // Function to render tweets on the page
  const renderTweets = function(tweets) {
    $('.tweet-container').empty(); // Clear the tweet container before rendering new tweets
    for (let tweet of tweets) {
      $('.tweet-container').prepend(createTweetElement(tweet)); // Append each tweet to the container
    }
  };

  // Function to load tweets from the server
  const loadTweets = () => {
    $.ajax({
      method: 'GET',
      url: '/tweets',
      success: (dataFromServer) => {
        console.log(dataFromServer);
        renderTweets(dataFromServer);
      }
    });
  }

  loadTweets(); // Initial load of tweets

  // Function to display error messages
  const showError = function(message) {
    $('.error-message').text(message).slideDown();
  };

  // Function to hide error messages
  const hideError = function() {
    $('.error-message').slideUp();
  };

  const $form = $('#tweet-submit');

  // Event handler for form submission
  $form.on('submit', (event) => {
    event.preventDefault();

    hideError();
    
    const formData = $form.serialize(); 
    const formText = $form.find("textarea").val().trim()

    if(!isTweetValid(formText.length)) {
      return;
    }

    // Ajax POST request to submit a new tweet
    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: formData,
      success: function()  {
        console.log("working")
        loadTweets();
        $form.find("textarea").val(''); // Clear the textarea
        $form.find(".counter").text(140); // Reset the counter
      },
      error: function(err)  {
        console.log(err)
      }
    });
  });
  
});

