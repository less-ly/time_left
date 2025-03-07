var rocky = require('rocky');

//function drawOrbits(ctx, cx, cy, length) {
//  var step = 1;
//  ctx.strokeStyle = 'black';
//
//  while (step < 4) {
//    ctx.beginPath();
//    ctx.arc(cx, cy, length * step, 0, 2 * Math.PI, false);
//    ctx.stroke();
//    step++;
//}};

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}

//function drawPlanet(ctx, cx, cy, angle, length, color) {
  // Find the points on the orbit
  //var x2 = cx + Math.sin(angle) * length;
  //var y2 = cy - Math.cos(angle) * length;

  // Actually draw a planet
  //ctx.fillstyle = color;
  //ctx.rockyFillRadial(x2, y2, 0, 5, 0, 2 * Math.PI);
//};

function drawTimeLeft(ctx, cx, cy, angle, length, color) {
  // Find the points for the "hand", i.e. the moving edge of the circle
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Actually draw a circle that represents how much time is left
  ctx.fillStyle = color;
  ctx.rockyFillRadial(cx, cy, 0, length, 0 - Math.PI / 2, angle - Math.PI / 2);
};

rocky.on('draw', function(event) {
  // Get the CanvasRenderingContext2D object
  var ctx = event.context;

  var background_color = 'white';

  // Draw white background
  ctx.fillStyle = background_color;
  ctx.fillRect(0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

  // Determine the width and height of the display
  var w = ctx.canvas.unobstructedWidth;
  var h = ctx.canvas.unobstructedHeight;

  // Current date/time
  var d = new Date();

  // Set the font
  //ctx.font = '18px Gothic'

  // Get the current day of the month in 2-digit format
  //var day = d.toLocaleTimeString(undefined, {day: '2-digit'});
  //day = day.substring(0, 2);

  // ctx.fillText(d.getDate().toString(), w / 2, h / 2, w);
  // getDate() doesn't put a preceding zero into 1-digit dates 

  // Determine the center point of the display
  // and the max size of a "watch hand", i.e. the shifting radial edge of the circle
  var cx = w / 2;
  var cy = h / 2;

  var maxLength = Math.max(w, h);

  // set the color for the planets
  var circle_color = 'black';

  // -
  // Calculate the "seconds hand", i.e. the 1st planet's angle
  var secondsFraction = (d.getSeconds() / 60);
  var secondsAngle = fractionToRadian(secondsFraction);

  // Draw the "seconds hand", i.e. the 1st planet from the center
  // drawPlanet(ctx, cx, cy, secondsAngle, minLength, color);
  // -

  // --
  // Calculate the "minutes hand", i.e. the 2nd planet's angle
  var minutesFraction = (d.getMinutes() % 60 + secondsFraction) / 60;
  var minutesAngle = fractionToRadian(minutesFraction);

  // Draw the "minutes hand", i.e. the 2nd planet from the center
  // drawPlanet(ctx, cx, cy, minutesAngle, minLength * 2, color);
  // --

  // --
  // Calculate the "hours hand", i.e. the 3rd planet's angle
  var hoursFraction = (d.getHours() % 12 + minutesFraction) / 12;
  var hoursAngle = fractionToRadian(hoursFraction);

  // Draw the "hours hand", i.e. the 3rd planet from the center
  //drawPlanet(ctx, cx, cy, hoursAngle, minLength * 3, color);
  // ---

  // Draw orbits
  //drawOrbits(ctx, cx, cy, minLength);

  // Draw circle that represents how much time is left
  drawTimeLeft(ctx, cx, cy, hoursAngle, maxLength, circle_color) 

  // ---
  // uncomment if need to adjust the planets' location and want and actual time reference
  var time = d.toLocaleTimeString();

  // Set the text color
  ctx.fillStyle = 'purple';

  // Center align the text
  ctx.textAlign = 'center';

  // adjust the central height for the text
  var text_cy = cy - 18 / 3 * 2 ;

  // Display the current date, in the middle of the screen
  ctx.fillText(time, cx, text_cy, w);

});

rocky.on('secondchange', function(event) {
  // Request the screen to be redrawn on next pass
  rocky.requestDraw();
});
