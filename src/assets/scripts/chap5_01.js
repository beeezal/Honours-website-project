
multiMouseSeekersScript = function (p) {
  class Seekers {
    constructor(maxCapacity = 40) {
      this.seekers = [];
      this.maxCapacity = maxCapacity;
    }

    addSeeker(x, y, r) {
      this.seekers.push(new Seeker(p, x, y, r));
    }

    run(target) {
      for (let i = this.seekers.length - 1; i >= 0; i--) {
        this.seekers[i].display();
        this.seekers[i].applyBehaviours(0.5, 0.5, target, false, this.seekers);
        this.seekers[i].update(true);
        if (this.seekers[i].isDead()) this.seekers.splice(i, 1);
      }
    }
  }
  let seekers = new Seekers();
  let mouse = p.createVector();

  p.initializeSketch = function() {
    seekers.seekers = [];
    for (let i = 0; i < seekers.maxCapacity; i++) {
      seekers.addSeeker(
        p.random(p.width * 0.25, p.width * 0.75),
        p.random(p.height * 0.25, p.height * 0.75),
        p.random([9,10,11])
      );
    }
    mouse.set(p.mouseX, p.mouseY);
    p.redraw();
  };

  p.setup = function() {
    p.noLoop();

    let cnv = p.createCanvas(700, 500);
    cnv.parent('sec1');

    p.initializeSketch();
  };

  p.draw = function() {
    p.background(220);
    seekers.run(mouse);
    mouse.set(p.mouseX, p.mouseY);
  };
}

let sec1Sketch = new p5(multiMouseSeekersScript, 'sec1');