$(document).ready(function() {
  console.log("composer-char-counter.js is loaded and ready");

  $('.new-tweet textarea').on('input', function() {
    const charCount = $(this).val().length;
    const charRemaining = 140 - charCount;
    
    const counter = $(this).closest('.new-tweet').find('.counter');
    counter.text(charRemaining);

    if (charRemaining < 0) {
      counter.addClass('over-limit');
    } else {
      counter.removeClass('over-limit');
    }
  });
});
