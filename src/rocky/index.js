var rocky = require('rocky');

// Adjust the frequence of changes to the watchface
// default value
var timeCycle = 'minutechange'

// debug value
//var timeCycle = 'secondchange'

function fractionToRadian(fraction) {
  // drawTimeElapsed() takes angles in radians, thus the need for conversion
  return fraction * 2 * Math.PI;
}

function drawTimeElapsed(ctx, cx, cy, angle, length, color) {
  // Draw a watch with an hour hand - its negative space more accurately speaking

  // set the color of the "negative space" - time already passed
  ctx.fillStyle = color;

  // shift the startAngle from 3 o'clock back to 12 o'clock
  var startAngle = 0 - (Math.PI / 2)
  // shift the endAngle along as well
  var endAngle = angle - (Math.PI / 2)

  // Actually draw the watch
  ctx.rockyFillRadial(cx, cy, 0, length, startAngle, endAngle);
};

rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  // Set white background
  var background_color = 'white';
  ctx.fillStyle = background_color;
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  var d = new Date();

  // Determine the center point of the display
  // and the max size of a "watch hand", i.e. the shifting radial edge
  var cx = w / 2;
  var cy = h / 2;
  // radial reaches beyond the display dimensions to fill as much space as possible 
  var maxLength = Math.max(w, h);

  // set the color for the radial, i.e. "negative space" of the watch
  var circle_color = 'black';

  // Get amount of time passed in hours plus fractional part for the "watch hand"
  // Calculate the amount of seconds passed
  var secondsFraction = (d.getSeconds() / 60);
  var secondsAngle = fractionToRadian(secondsFraction);

  // Calculate the amount of minutes passed, plus a fractional part of seconds 
  var minutesFraction = (d.getMinutes() % 60 + secondsFraction) / 60;
  var minutesAngle = fractionToRadian(minutesFraction);

  // Calculate the amount of hours   passed, plus a fractional part of mintues and seconds
  var hoursFraction = (d.getHours() % 12 + minutesFraction) / 12;
  var hoursAngle = fractionToRadian(hoursFraction);

  // Draw a watch - its "negative space" - i.e. how much time has already passed
  // in hours - suitable for the whole day
  drawTimeElapsed(ctx, cx, cy, hoursAngle, maxLength, circle_color) 

  // - For debugging and testing START -

  // SIDENOTE: CanvasRenderingContext2D draws graphical objects 
  // from bottom to top in order of appearance with function calls.
  // Thus the following text is drawn on the very top.

  // Draw a watch - its "negative space" - i.e. how much time has already passed
  // in seconds - suitable for general debugging
  //drawTimeElapsed(ctx, cx, cy, secondsAngle, maxLength, circle_color) 

  // Draw a watch - its "negative space" - i.e. how much time has already passed
  // in minutes - suitable for additional testing
  //drawTimeElapsed(ctx, cx, cy, minutesAngle, maxLength, circle_color) 

  // Just get the time
  //var time = d.toLocaleTimeString();

  // Set the font
  //ctx.font = '18px Gothic'

  // Set the text color, the one constrasting with the existing ones
  //ctx.fillStyle = 'purple';

  // Center align the text
  //ctx.textAlign = 'center';

  // Adjust the central height for the text
  //var text_cy = cy - 18 / 3 * 2 ;

  // Display the current time, in the middle of the screen
  //ctx.fillText(time, cx, text_cy, w);

  // - For debugging and testing END -
});

rocky.on(timeCycle, function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
