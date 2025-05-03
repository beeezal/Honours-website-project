let SquareWalkerScript = function(p) {
  class Walker {
    constructor(x, y, r) {
      this.location = p.createVector(x, y);
      this.velocity = p5.Vector.random2D();  
      this.r = r; 
      this.D = r * 2;
      this.sa = p.random(0, p.TWO_PI);
    }
    
    display() {
      p.stroke(0);
      p.fill(100);
      p.strokeWeight(this.r/3);
      p.line(
        this.location.x - this.velocity.x, 
        this.location.y - this.velocity.y,
        this.location.x, 
        this.location.y
      );
      p.strokeWeight(1);
      p.circle(this.location.x, this.location.y, this.D);
    }
    
    update(vel_mag=1, chk_edges=false) {
      if (p.frameCount % 3 == 0) {
        this.sa = p.random(0, p.TWO_PI);
      }
      this.velocity.set(p.cos(this.sa), p.sin(this.sa));
      this.velocity.mult(vel_mag);
      this.location.add(this.velocity);
      if (chk_edges) this.checkEdges();
    }
    
    checkEdges() {
      if (this.location.x > p.width + this.r) {
        this.location.x -= (p.width + this.r);
      } else if (this.location.x < -this.r) {
        this.location.x += (p.width + this.r);
      }
      if (this.location.y > p.height + this.r) {
        this.location.y -= (p.height + this.r);
      } else if (this.location.y < -this.r) {
        this.location.y += (p.height + this.r);
      }
    }
  }

  let w = new Walker(p.width / 2, p.height / 2, 5);
  let vel_mag = 3;

  p.randomSquared = function() {
    let x = p.random(); 
    let y = p.random(); 
    while (y > x**2) {
      x = y;
      y = p.random();
    }
    return x;
  };

  p.initializeSketch = function() {
    w.location.set(p.width / 2, p.height / 2);
    w.velocity = p5.Vector.random2D();
    w.sa = p.random(0, p.TWO_PI);
    p.background(255);

    p.redraw();
  };

  p.setup = function() {
    p.noLoop();

    let cnv = p.createCanvas(600, 400);
    cnv.parent('sec3');

    p.initializeSketch();
  };

  p.draw = function() {
    w.display();
    vel_mag = (p.frameCount % 180 === 0) ? p.randomSquared() * 50 : 3;
    w.update(vel_mag, true);
  };
};

let sec3Sketch = new p5(SquareWalkerScript, 'sec3');