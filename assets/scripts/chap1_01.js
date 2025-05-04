let simpleMoverScript = function(p) {
  let x_coord, y_coord, timeTaken, speed;
  let timeSlider, timeLabel, resetLabel;

  p.initializeSketch = function() {
    x_coord = p.width/2;
    y_coord = p.height/2;
    timeTaken = timeSlider.value();
    speed = 250/timeTaken;

    p.fill(100);

    p.redraw();
  };

  p.setup = function() {
    p.noLoop();

    let cnv = p.createCanvas(600, 400);
    cnv.parent('sec1');

    let container = document.getElementById('interactive-controls-sec1');

    timeSlider = p.createSlider(60, 300, 90, 1);
    timeSlider.parent(container);
    timeLabel = p.createSpan('Time (frames): ' + timeSlider.value())
    timeLabel.parent(container);

    resetLabel = p.createSpan('Reset to see effect');
    resetLabel.parent(container);
    resetLabel.style('display', 'flex');

    timeSlider.input(() =>{
			timeLabel.html('Time (frames): ' + timeSlider.value());
		})

    p.initializeSketch();
  };

  p.draw = function() {
    if (x_coord <= p.width/2 + 250) {
      p.background(255);
      x_coord += speed;
      p.circle(x_coord, y_coord, 20);
    } else {
      p.initializeSketch();
    }
  };
};

let sec1Sketch = new p5(simpleMoverScript, 'sec1');