let normalWalkerScript = function(p) {
  class WalkerNormal {
    constructor(x, y, r) {
      this.location = p.createVector(x, y);
      this.velocity = p5.Vector.random2D();  
      this.r = r;    
      this.D = this.r * 2;                       
      this.velAngle = this.velocity.heading();
    }
    
    display() {
      p.stroke(0);
      p.fill(100);
      p.strokeWeight(1);
      p.circle(this.location.x, this.location.y, this.D);
    }
    
    update(vel_mag=1, chk_edges=false, stdDev=p.PI/8) {
      if (p.frameCount % 3 === 0) {
        this.velAngle = p.randomGaussian() * stdDev + this.velocity.heading();
      }
      this.velocity.set(p.cos(this.velAngle), p.sin(this.velAngle));
      this.velocity.mult(vel_mag);
      this.location.add(this.velocity);
      if (chk_edges) {this.checkEdges()};
    }
    
    checkEdges() {
      if (this.location.x > p.width) this.location.x = 0;
      else if (this.location.x < 0) this.location.x = p.width;
      if (this.location.y > p.height) this.location.y = 0;
      else if (this.location.y < 0) this.location.y = p.height;
    }
  }

  let w = new WalkerNormal(p.width/2, p.height/2, 10);
  let stdDevSlider, label, container;

  let stdDev = p.PI/8;

  p.initializeSketch = function() {
    w.location.set(p.width/2, p.height/2);
    w.velocity.set(p5.Vector.random2D());
    p.background(255);

    p.redraw();
  };

  p.setup = function() {
    p.noLoop();

    let cnv = p.createCanvas(700, 400);
    cnv.parent('sec2');
    container = document.getElementById('interactive-controls-sec2');


    stdDevSlider = p.createSlider(p.PI/60, p.PI/6, p.PI/8, 0);
    stdDevSlider.parent(container);
    label = p.createSpan('Std Dev: ' + p.degrees(stdDevSlider.value()).toFixed(3) + '°');
    label.parent(container);

    stdDevSlider.input(() => {
      label.html('Std Dev: ' + p.degrees(stdDevSlider.value()).toFixed(3) + '°');
      stdDev = stdDevSlider.value();
    });

    p.initializeSketch();
  };

  p.draw = function() {
    w.display();
    w.update(3, true, stdDev);
  };

};

let sec2Sketch = new p5(normalWalkerScript, 'sec2');