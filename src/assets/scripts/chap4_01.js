let seekerScript = function(p) {
  let mv = new Seeker(p, p.width / 2, p.height / 2, 16);
  let mouse = p.createVector(p.mouseX, p.mouseY);
  let chkArrival;
  let arrivalVal = false;

  p.initializeSketch = function () {
    mv.pos.set(p.width / 2, p.height / 2);
    mv.vel.set();

    p.redraw();
  }

  p.setup = function () {
    p.noLoop(); 

    let canvas = p.createCanvas(750,400);
    canvas.parent('sec1');

    let container = p.select('#interactive-controls-sec1');

    chkArrival = p.createCheckbox('Arrive Behaviour?', arrivalVal);
    chkArrival.parent(container);

    p.initializeSketch();
  }

  p.draw = function () {
    p.background(255);
    p.fill(100);
    mv.display(true);

    mouse.set(p.mouseX, p.mouseY);
    mv.update(mouse, chkArrival.checked(), true);
  }
}

let sec1Sketch = new p5(seekerScript, 'sec1');