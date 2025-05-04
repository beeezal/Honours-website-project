
let perlinScript = function (p) {
  class PerlinWalker {
    xOffset = 0;
    yOffset = 1000;
    magOffset = 2000;

    constructor(x, y, r) {
      this.pos = p.createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.r = r;
      this.posHistory = [];
      this.showHistory = true;
    }

    display() {
      if (this.showHistory) {
        for (let i = 0; i < this.posHistory.length - 1; i++) {
          let prevPos = this.posHistory[i];
          let currPos = this.posHistory[i + 1];
          let posChange = p5.Vector.dist(prevPos, currPos);
          if (posChange >= p.width || posChange >= p.height) {
            continue;
          }
          p.line(prevPos.x, prevPos.y, currPos.x, currPos.y);
        }
      }

      p.stroke(0);
      p.fill(100);
      p.circle(this.pos.x, this.pos.y, this.r * 2);
    }

    step(vel_mag = 3, chk_edges = true) {
      this.updatePosHistory();

      PerlinWalker.noisyVelocity(this.xOffset, this.yOffset, this.vel);

      this.vel.setMag(vel_mag);
      this.pos.add(this.vel);

      this.xOffset += 0.01;
      this.yOffset += 0.01;

      if (chk_edges) { this.checkEdges(); }
    }

    static noisyVelocity(xOffset, yOffset, vector) {
      vector.set(p.map(p.noise(xOffset), 0, 1, -1, 1),
        p.map(p.noise(yOffset), 0, 1, -1, 1)
      );
    }

    updatePosHistory(maxArrayLength = 500) {
      this.posHistory.push(this.pos.copy());
      if (this.posHistory.length > maxArrayLength) {
        this.posHistory.shift();
      }
    }

    checkEdges() {
      if (this.pos.x > p.width + this.r) {
        this.pos.x = this.pos.x - (p.width + this.r);
      } else if (this.pos.x < -this.r) {
        this.pos.x = p.width + (this.pos.x + this.r);
      }
      if (this.pos.y > p.height + this.r) {
        this.pos.y = this.pos.y - (p.height + this.r);
      } else if (this.pos.y < -this.r) {
        this.pos.y = p.height + (this.pos.y + this.r);
      }
    }
  }

  let noiseWalker = new PerlinWalker(p.width / 2, p.height / 2, 12);

  p.initializeSketch = function () {
    noiseWalker.pos.set(p.width / 2, p.height / 2);
    noiseWalker.posHistory = [];

    p.redraw();
  }

  p.setup = function () {
    p.noLoop();
    
    let canvas = p.createCanvas(850, 550);
    canvas.parent('sec4');

    p.initializeSketch();
  }

  p.draw = function () {
    p.background(255);
    noiseWalker.display();
    noiseWalker.step(3, true);
  }
}

let sec4Sketch = new p5(perlinScript, 'sec4');