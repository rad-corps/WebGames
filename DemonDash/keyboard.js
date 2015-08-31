//https://github.com/kittykatattack/learningPixi#keyboard
//var realWindow = window.parent || window;

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  // realWindow.addEventListener(
  //   "keydown", key.downHandler.bind(key), false
  // );
  // realWindow.addEventListener(
  //   "keyup", key.upHandler.bind(key), false
  // );

addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}