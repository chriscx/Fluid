// Provided your current check is firing when scrolled to the page's bottom, you can try some basic arithmetics:

// if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.7){
//                                           //where 0.7 corresponds to 70% --^
// Make sure to add a check to don't fire multiple simultaneous Ajax requests, if you didn't already.

// This is rather out of the scope of the question, but if you want an example of how to prevent multiple requests from being fired simultaneously:

// Declare a global var, e.g. processing.

// Then incorporate it in your function:

// if (processing)
//     return false;

// if ($(window).scrollTop() >= ($(document).height() - $(window).height())*0.7){
//     processing = true; //sets a processing AJAX request flag
//     $.post("url", '<params>', function(data){ //or $.ajax, $.get, $.load etc.
//         //load the content to your div
//         processing = false; //resets the ajax flag once the callback concludes
//     });
// }
// That's a simple example of using a var to keep track if there is an active Ajax request for your scroll function or not, and it doesn't interfere with any other concurring Ajax request which you may have.

// Edit: JSFiddle example

// Please note that using a % to measure the document height might be a bad idea, considering that the document's height will increase each time you load something, making it trigger the Ajax request being relatively more far from the bottom of the page (absolute-size wise).

// I'd recommend using a fixed value offset to prevent that (200-700 or so):

// if ($(window).scrollTop() >= $(document).height() - $(window).height() - 700){
//                                  // pixels offset from screen bottom   --^
// Example: JSFiddle

// Edit: To reproduce the issue in the first code with percentages, load 50 divs into it. When you load the next div, it'll add only 2% to the total document's height, meaning the next request will be triggered as soon as you scroll these 2% back to the 70% of the document's height. In my fixed example, the defined bottom offset will load new content only when the user is at a defined absolute pixels range from the bottom of the screen.

createEntry = function(this, config) {
	$.ajax({  
    type: 'POST',  
    url: config['baseurl'] + '/blog/post/', 
    data: { id_note: id },
    success: function(response) {

        }
    }});
};

removeEntry = function() {

};

updateEntry = function() {

};

getEntry = function() {

};

getCategories = function() {

};