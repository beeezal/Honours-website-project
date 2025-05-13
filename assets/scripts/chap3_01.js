let OGPerlinScript = function (p) {
  class Walker {
  
    xOffset = 0;
    yOffset = 1000;
    magOffset = 2000;
    constructor(x, y, r) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.D = this.r * 2;
    }

    display() {
      p.stroke(0);
      p.fill(100);
      p.circle(this.x, this.y, this.D);
    }

    update(affecting_params = 'direction', chk_edges = true) {
      let noiseX = p.noise(this.xOffset);
      let noiseY = p.noise(this.yOffset);
      const behaviors = {
        direction: () => {
          this.x += (noiseX - 0.5) * 8;
          this.y += (noiseY - 0.5) * 8;
        },
        location: () => {
          this.x = noiseX * p.width;
          this.y = noiseY * p.height;
        },
        step: () => {
          let vel_mag = p.noise(this.magOffset) * (this.r * 1.5);
          this.x += (noiseX - 0.5) * 2 * vel_mag;
          this.y += (noiseY - 0.5) * 2 * vel_mag;
          this.magOffset += 0.01;
        }
      };

      behaviors[affecting_params]();

      this.xOffset += 0.01;
      this.yOffset += 0.01;

      if (chk_edges){ this.checkEdges(); }
    }

    checkEdges() {
      if (this.x > p.width + this.r) {
        this.x = this.x - (p.width + this.r);
      } else if (this.x < -this.r) {
        this.x = p.width + (this.x + this.r);
      }
      if (this.y > p.height + this.r) {
        this.y = this.y - (p.height + this.r);
      } else if (this.y < -this.r) {
        this.y = p.height + (this.y + this.r);
      }
    }
  }
  
  let w = new Walker(p.width / 2, p.height / 2, 8);
  let paramsRadio, chosenParam;

  p.initializeSketch = function () {
    p.background(255);

    chosenParam = paramsRadio.value();
    if (chosenParam !== 'location'){
      w.x = p.width / 2;
      w.y = p.height / 2;
    }
    else (w.update('location'));

    p.redraw();
  }


  p.setup = function () {
    p.noLoop();

    let canvas = p.createCanvas(850, 550);
    canvas.parent('sec1');

    let container = p.select('#interactive-controls-sec1');
    paramsRadio = p.createRadio();
    paramsRadio.option('direction', 'Direction');
    paramsRadio.option('location', 'Location');
    paramsRadio.option('step', 'Step Size + Direction');
    paramsRadio.selected('direction');
    paramsRadio.parent(container);

    resetLabel = p.createSpan('Reset to see effect');
    resetLabel.parent(container);
    resetLabel.style('display', 'flex');

    p.initializeSketch();
  }

  p.draw = function () {
    w.display();
    w.update(chosenParam);
  }
}

let sec1Sketch = new p5(OGPerlinScript, 'sec1');