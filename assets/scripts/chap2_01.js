let basicRWalkerScript = function (p) {
  class Walker {
    constructor() {
      this.x = p.width / 2;
      this.y = p.height / 2;
    }

    display() {
      p.stroke(0);
      p.point(this.x, this.y);
    }

    update() {
      this.x += p.random(-1, 1);
      this.y += p.random(-1, 1);
    }
  }

  let w = new Walker();

  p.initializeSketch = function() {
    p.background(255);
    
		w.x = p.width / 2;
    w.y = p.height / 2;
    p.redraw();
	}

  p.setup = function () {
    p.noLoop();

    let cnv = p.createCanvas(500, 400);
		cnv.parent('sec1');
    p.background(255);

    p.initializeSketch();
  }

  p.draw = function () {
    w.display();
    w.update();
  }
}

let sec1Sketch = new p5(basicRWalkerScript, 'sec1');