var eventBar;
var mouseOrigin;
var eventOpen;
var eventDetails;
var eventHeight;
var dragDown;
var dragUp;
var mouseOrigin;
var touchTimer;

Date.prototype.format = function() {
  var months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December');
  var result = months[this.getMonth()] + ' ' + this.getDate() + ', ' + this.getFullYear();

  return result;
}

$(document).ready(function(){
	eventOpen = false;
	
	eventBar = document.getElementById('event');
	eventDetails = document.getElementById('event-info');
	dragDown = document.getElementById('drag-bar');
	dragUp = document.getElementById('drag-up');
	
	eventDetails.style.display = 'block';
	eventHeight = eventDetails.offsetHeight;
	eventDetails.style.display = 'block';
	eventDetails.style.height = 0;
	eventDetails.style.marginTop = 0;

	$('#drag-bar').click(toggleEvent);
	$('#drag-up').click(toggleEvent);

	if(dragDown.addEventListener) {
		dragDown.addEventListener('touchstart', touchHandler, false);
		dragUp.addEventListener('touchstart', touchHandler, false);
	}

  'cocoaheadsdc'.twitter(function() {
    $('ul#tweets').append('<li><p class="tweet-date"><a href="' + this.url + '">' + this.createdAt.format() + '</a></p><p class="tweet">' + this.status + '</p></li>');
  }, null);

	$('#speakers_guide, #archives').fancybox({
		'width'				  : '75%',
		'height'			  : '75%',
		'autoScale'			: false,
		'transitionIn'	: 'none',
		'transitionOut'	: 'none',
		'type'				  : 'iframe'
	});
});



function toggleEvent(e) {	
	eventOpen = !eventOpen;
	
	if(eventOpen) {
		dragUp.style.display = 'block';
		dragDown.style.display = 'none';
		$('#event-info').animate({
			'height': eventHeight + 20
		}, 250);
	} else {
		dragUp.style.display = 'none';
		dragDown.style.display = 'block';
		$('#event-info').animate({
			'height': 0
		}, 250);
	}
	
}

function animateEvent(element, property, targetValue, callback) {
	var ease = .25;
	
	var animation = setInterval(function() {
		var currentHeight = Number(element.style[property].split('px')[0]);
		
		var distance = targetValue - currentHeight;
		var target = distance * ease;
		
		if(Math.abs((currentHeight + target) - targetValue) > 1) {
			element.style[property] = (currentHeight + target) + 'px';
		} else {
			element.style[property] = targetValue + 'px';
			if(callback) {
				callback();
			}
			clearInterval(animation);
		}
	}, 10);
}


function touchHandler(e) {
	e.preventDefault();
	switch(e.type) {
		case "touchstart":
			touchTimer = {
				count: 0,
				timer: setInterval(function() {
					touchTimer.count += 1;
				}, 1)
			}
			dragDown.removeEventListener('touchstart', touchHandler);
			if(e.target == dragDown) {
				document.addEventListener("touchmove", dragDownHandler, false);
			} else {
				document.addEventListener("touchmove", dragUpHandler, false);
			}
			
			document.addEventListener("touchend", touchHandler, false);			
			
			mouseOrigin = e.targetTouches[0].pageY;
			break;
		case "touchmove":
			if(e.currentTarget == dragDown) {
				var offset = e.targetTouches[0].pageY - mouseOrigin;
				eventDetails.style.height = (offset < eventHeight + 20 ? offset : eventHeight + 20) + 'px';
			}			
			
			
			break;
		case "touchend":
			document.removeEventListener("touchmove", dragDownHandler);
			document.removeEventListener("touchmove", dragUpHandler);
			document.removeEventListener("touchend", touchHandler);
			dragDown.addEventListener('touchstart', touchHandler, false);
			
			var currentHeight = Number(eventDetails.style.height.split('px')[0]);
			if(currentHeight > eventHeight / 2) {
				dragUp.style.display = 'block';
				dragDown.style.display = 'none';
				animateEvent(eventDetails, 'height', eventHeight + 20);
			} else {
				dragUp.style.display = 'none';
				dragDown.style.display = 'block';
				animateEvent(eventDetails, 'height', 0);
			}
			
			clearInterval(touchTimer.timer);
			
			if(touchTimer.count < 50) {
				toggleEvent();
			}
			
			touchTimer.count = 0;
			
			
			break;
	}	
}

function dragDownHandler(e) {
	var offset = e.targetTouches[0].pageY - mouseOrigin;
	eventDetails.style.height = (offset < eventHeight + 20 ? offset : eventHeight + 20) + 'px';
}

function dragUpHandler(e) {
	var offset = eventHeight + e.targetTouches[0].pageY - mouseOrigin;
	eventDetails.style.height = (offset < eventHeight + 20 ? offset : eventHeight + 20) + 'px';
}