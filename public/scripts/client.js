/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 240000000
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

$(document).ready(function() {
  
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
  
  const isTweetValid = function(text) {
    if (text <= 0) {
      // alert("The textarea cannot be empty."); 
      showError("The textarea cannot be empty.");
      return false; 
    };

    if (text > 140) {
      // alert("The textarea cannot exceed 140 characters. Please shorten your message."); 
      showError("The textarea cannot exceed 140 characters. Please shorten your message.");
      return false; 
    };

    return true;
  }

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

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

  const renderTweets = function(tweets) {
    // Clear the tweet container before rendering new tweets
    $('.tweet-container').empty();
    // loops through tweets
    for (let tweet of tweets) {
      // calls createTweetElement for each tweet
      // takes return value and appends it to the tweets container
      $('.tweet-container').prepend(createTweetElement(tweet));
    }
  };

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

  loadTweets();

  const showError = function(message) {
    $('.error-message').text(message).slideDown();
  };

  const hideError = function() {
    $('.error-message').slideUp();
  };

  const $form = $('#tweet-submit');

  $form.on('submit', (event) => {
    event.preventDefault();

    hideError();
    
    const formData = $form.serialize(); 
    const formText = $form.find("textarea").val().trim()

    if(!isTweetValid(formText.length)) {
      $form.find("textarea").val('');
      $form.find(".counter").text(140);
      return;
    }

    $.ajax({
      method: 'POST',
      url: '/tweets',
      data: formData,
      success: function()  {
        console.log("working")
        // console.log(formData)
        // console.log(formText)
        // console.log(formText.length)
        loadTweets();
        $form.find("textarea").val('');
        $form.find(".counter").text(140);
      },
      error: function(err)  {
        console.log(err)
      }
    });
  });
  
});

