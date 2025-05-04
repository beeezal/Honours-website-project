class Wanderer extends Seeker {
  constructor(p, x, y, r) {
    super(p, x, y, r);
    this.wanderRadius = 24;
    this.predictionInterval = 80;
    this.predictedPos = this.p.createVector(0, 0);
    this.targetAngle = this.p.radians(this.p.random(0, 360));
    this.displayWanderCircle = false;
  }

  #target = p5.Vector.fromAngle(this?.targetAngle ?? 0);

  calculateWanderTarget() {
    this.predictedPos.set(p5.Vector.setMag(this.vel, this.predictionInterval));
    this.predictedPos.add(this.pos);
    this.targetAngle += this.p.random(-0.3, 0.3);
    this.#target.set(p5.Vector.fromAngle(this.targetAngle + this.vel.heading(), this.wanderRadius));
    this.#target.add(this.predictedPos);
  }

  displayCircle() {
    this.p.noFill();
    this.p.line(this.pos.x, this.pos.y, this.predictedPos.x, this.predictedPos.y);
    this.p.circle(this.predictedPos.x, this.predictedPos.y, this.wanderRadius * 2);
    this.p.line(this.predictedPos.x, this.predictedPos.y, this.#target.x, this.#target.y);
    this.p.circle(this.#target.x, this.#target.y, 5);
  }

  display(dinstingDirection = false, mouthSize = this.p.PI / 10) {
    if (this.displayWanderCircle) {
      this.displayCircle();
    }
    super.display(dinstingDirection, mouthSize);
  }

  get target() {
    return this.#target;
  }
}

let wandererScript = function(p) {
  let wanderer = new Wanderer(p, p.width / 2, p.height / 2, 12);
  let  checkboxRandom, checkboxDisplayCircle;

  p.initializeSketch = function () {
    wanderer.pos.set(p.width / 2, p.height / 2);
    wanderer.posHistory = [];

    p.redraw();
  }
  

  p.setup = function () {
    p.noLoop(); 

    let canvas = p.createCanvas(850, 550);
    canvas.parent('sec3');

    wanderer.showHistory = true;

    let container = p.select('#interactive-controls-sec3');

    checkboxDisplayCircle = p.createCheckbox('Show Wander Circle', false);
    checkboxDisplayCircle.parent(container);

    checkboxRandom = p.createCheckbox('Random Radius', false);
    checkboxRandom.parent(container);
    checkboxDisplayCircle.input(() => {
      wanderer.displayWanderCircle = checkboxDisplayCircle.checked();
    });

    p.initializeSketch();
  }

  p.draw = function () {
    p.background(255);
    p.fill(100);

    wanderer.display();

    if (checkboxRandom.checked()) {
      wanderer.wanderRadius = p.constrain(
        wanderer.wanderRadius + p.random(-2, 2), 
        5, 
        68
      );
    }
    wanderer.calculateWanderTarget();
    wanderer.update(wanderer.target, false, true);
  }
}

let sec3Sketch = new p5(wandererScript, 'sec3');