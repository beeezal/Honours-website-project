let rWalkerScript = function(p) {
  class rWalker {
    constructor(x, y, r) {
      this.location = p.createVector(x, y);
      this.v = p5.Vector.random2D();
      this.r = r;
      this.sa = p.random(0, p.TWO_PI);
      this.life = 10 * 60;
    } 

    step(step_size = 1, t_inteval = 1) {
      if (this.life % t_inteval == 0) {
        this.sa = p.random(0, p.TWO_PI);
      }
      this.v.set(p.cos(this.sa), p.sin(this.sa));
      this.v.mult(step_size);
      this.location.add(this.v);
    }

    display() {
      p.stroke(0);
      p.fill(100);
      p.circle(this.location.x, this.location.y, this.r);
      this.life -= 1;
    }

    isDead() {
      return (this.life <= 0);
    }
  }

  class rWalkerSystem {
    constructor() {
      this.walkers = [];
    }

    addWalker(x, y, r) {
      this.walkers.push(new rWalker(x, y, r));
    }

    run() {
      let length = this.walkers.length - 1;
      for (let i = length; i >= 0; i--) {
        this.walkers[i].step(3, 15);
        this.walkers[i].display();
        if (this.walkers[i].isDead()) {
          this.walkers.splice(i, 1);
        }
      }
    } 
  }

  let rWalkers = new rWalkerSystem();

  p.initializeSketch = function() {
    rWalkers.walkers = [];
    for (let i = 0; i < 5; i++) {
      rWalkers.addWalker(
        p.random(p.width/3, 2*p.width/3), 
        p.random(p.height/3, 2*p.height/3), 
        15
      );
    }
    
    p.background(255);
    p.redraw();
  };

  p.setup = function() {
    p.noLoop();

    let cnv = p.createCanvas(700, 500);
    cnv.parent('sec4');
    
    p.initializeSketch();
  };

  p.draw = function() {
    p.background(255, 40);
    rWalkers.run();
  };

  p.mouseDragged = function() {
    rWalkers.addWalker(p.mouseX, p.mouseY, 15);
    if (!isLooping()) p.redraw();
  };
};

let sec4Sketch = new p5(rWalkerScript, 'sec4');