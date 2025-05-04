let FlockerScript = function (p) {
  class Flock {
    constructor() {
      this.flock = [];
      this.maxCapacity = 50;
      this.curIndex = this.maxCapacity - 1;
    }

    addMover(x, y, r) {
      this.flock.push(new AutonMover(p, x, y, r));
    }

    applyBehaviours(mover = this.flock[0], sepW = sepWeight, cohereW = cohereWeight, alignW = alignWeight) {
      let sepForce = p5.Vector.mult(mover.separate(this.flock), sepW);
      let alignForce = p5.Vector.mult(mover.align(this.flock), alignW);
      let cohereForce = p5.Vector.mult(mover.cohere(this.flock), cohereW);
      mover.applyForce(p5.Vector.add(sepForce, p5.Vector.add(cohereForce, alignForce)));
    }

    run(chk_edges = true) {
      for (; this.curIndex > 0; this.curIndex--) {
        this.flock[this.curIndex].display();
        this.applyBehaviours(this.flock[this.curIndex]);
        this.flock[this.curIndex].update(chk_edges);
        if (this.flock[this.curIndex].isDead()) {
          this.flock.splice(this.curIndex, 1);
        }
      }
      this.curIndex = this.maxCapacity - 1;
    }
  }

  let flock= new Flock();
  let sepSlider, alignSlider, cohereSlider;
  let sepWeight = 1, alignWeight = 0.5, cohereWeight = 0.5;

  p.initializeSketch = function () {
    flock.flock = [];
    for (let i = 0; i < flock.maxCapacity; i++) {
      flock.addMover(
        p.random(p.width * 0.3, p.width * 0.7),
        p.random(p.height * 0.3, p.height * 0.7),
        10
      );
    }

    p.redraw();
  };

  p.setup = function () {
    p.noLoop();

    let cnv = p.createCanvas(850, 600);
    cnv.parent('sec2');
    let container = document.getElementById('interactive-controls-sec2');

    sepSlider = p.createSlider(0.5, 2.5, 1, 0.25);
    sepSlider.parent(container);
    sepLabel = p.createSpan('Separation: ' + sepSlider.value())
    sepLabel.parent(container);

    alignSlider = p.createSlider(0.5, 2.5, 0.5, 0.25);
    alignSlider.parent(container);
    alignLabel = p.createSpan('Align:' + alignSlider.value());
    alignLabel.parent(container);

    cohereSlider = p.createSlider(0.5, 2.5, 0.5, 0.25);
    cohereSlider.parent(container);
    cohereLabel = p.createSpan('Cohere:' + cohereSlider.value());
    cohereLabel.parent(container);

    sepSlider.input(() => {
      sepWeight = sepSlider.value();
      sepLabel.html('Separation: ' + sepWeight);
    });

    alignSlider.input(() => {
      alignWeight = alignSlider.value();
      alignLabel.html('Align: ' + alignWeight);
    });

    cohereSlider.input(() => {
      cohereWeight = cohereSlider.value();
      cohereLabel.html('Cohere: ' + cohereWeight);
    });

    p.initializeSketch();
  };

  p.draw = function () {
    p.background(220);
    flock.run();
  };

};

let sec2Sketch = new p5(FlockerScript, 'sec2');