let evaderScript = function(p) {
  let mv = new Evader(p, p.width / 2, p.height / 2, 16);
  let mouse = p.createVector(p.mouseX, p.mouseY);
  let safeAwareChkbox;

  p.initializeSketch = function () {
    mv.pos.set(p.width / 2, p.height / 2);
    mv.vel.set();

    p.redraw();
  }

  p.setup = function () {
    p.noLoop(); 

    let canvas = p.createCanvas(750,400);
    canvas.parent('sec2');

    let container = p.select('#interactive-controls-sec2');

    safeAwareChkbox = p.createCheckbox('Safe Aware?', false);
    safeAwareChkbox.parent(container);

    p.initializeSketch();
  }

  p.draw = function () {
    p.background(255);
    p.fill(100);
    mv.display(true);

    mouse.set(p.mouseX, p.mouseY);
    mv.update(mouse, safeAwareChkbox.checked(), true);
  }
}

let sec2Sketch = new p5(evaderScript, 'sec2');