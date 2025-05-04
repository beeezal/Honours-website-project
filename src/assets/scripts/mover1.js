class AutonMover {
  constructor(p, x, y, r) {
    this.p = p; // Store the p5 instance
    this.r = r;
    this.D = r * 2;                  //Diameter of the particle - used in defining shapes 

    this.pos = this.p.createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = this.p.createVector(0, 0);
    this.desired_vel = this.p.createVector();

    this.maxSpeed = 5;
    this.maxForce = 0.125;

    this.posHistory = [];
    this.showHistory = false;
  }

  applyForce(force) {
    this.acc.add(force);
  }

  updateHistory() {
    this.posHistory.push(this.pos.copy());
    if (this.posHistory.length > 500) {
      this.posHistory.shift();
    }
  }

  display(dinstingDirection = false, mouthSize = this.p.PI / 10) {
    if (dinstingDirection) {
      //Save local state and draw an oscillating mouth animation 
      //To visualise the direction of motion
      this.p.push();
      this.p.fill(100);
      this.p.translate(this.pos.x, this.pos.y);    // Changes the origin to the current position of agent
      this.p.rotate(this.vel.heading());           // Rotate the coordinate plane s.t., positive x-axis is along vel.heading
      let lowerLip = mouthSize / 2 * this.p.sin(this.p.frameCount * 0.1) + mouthSize / 2;
      this.p.arc(0, 0, this.D, this.D, lowerLip, this.p.TWO_PI - lowerLip, this.p.PIE);
      this.p.pop();  //Return to orgianl saved state - includes origin and rotation
    }
    else {
      this.p.fill(100);
      this.p.circle(this.pos.x, this.pos.y, this.D);
    }
  }

  steer() {
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce);

    this.applyForce(steer);
  }

  checkEdges() {
    //Checking if the walker has crossed the canvas edges, if so - wrap around
    if (this.pos.x > this.p.width + this.r) {
      this.pos.x = this.pos.x - (this.p.width + this.r);
    } else if (this.pos.x < -this.r) {
      this.pos.x = this.p.width + (this.pos.x + this.r);
    }
    if (this.pos.y > this.p.height + this.r) {
      this.pos.y = this.pos.y - (this.p.height + this.r);
    } else if (this.pos.y < -this.r) {
      this.pos.y = this.p.height + (this.pos.y + this.r);
    }
  }
}

class Seeker extends AutonMover {
  seek(target, arrive = false) {
    this.desired_vel = p5.Vector.sub(target, this.pos);
    let distance = this.desired_vel.mag();

    if (arrive && distance < 100) {
      let desiredMag = this.p.map(distance, 0, 100, 0, this.maxSpeed);
      this.desired_vel.setMag(desiredMag);
    }
    else { this.desired_vel.setMag(this.maxSpeed) };

    this.steer();
  }

  update(target, arrive = false, chk_edges = false) {
    this.updateHistory();

    this.seek(target, arrive);
    this.vel.add(this.acc);
    this.pos.add(this.vel); 
    this.acc.mult(0);

    if (chk_edges) { this.checkEdges(); }
  }

  display(dinstingDirection = false, mouthSize = this.p.PI / 10) {
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length - 1; i++) {
        let prevPos = this.posHistory[i];
        let currPos = this.posHistory[i + 1];

        let posChange = p5.Vector.dist(prevPos, currPos);
        if (posChange >= this.p.width || posChange >= this.p.height) {
          continue;
        }
        this.p.line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    }
    super.display(dinstingDirection, mouthSize);
  }
}

class Evader extends AutonMover {
  evade(target, safeAware = false) {
    this.desired_vel = p5.Vector.sub(this.pos, target);
    let distance = this.desired_vel.mag();

    if (safeAware) {
      if (distance < 70) {
        let desiredMag = this.p.map(distance, 70, 0, this.maxSpeed, this.maxSpeed * 2);
        this.desired_vel.setMag(desiredMag);
      }
      else if (distance > 250) {
        let desiredMag = this.p.map(distance, 320, 250, this.maxSpeed * 0.2, this.maxSpeed, true);
        this.desired_vel.setMag(desiredMag);
      }
    } else { this.desired_vel.setMag(this.maxSpeed) };

    this.steer();
  }

  update(target, safeAware = false, chk_edges = false) {
    this.updateHistory();

    this.evade(target, safeAware);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (chk_edges) { this.checkEdges(); }
  }

  display(dinstingDirection = false, mouthSize = this.p.PI / 10) {
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length - 1; i++) {
        let prevPos = this.posHistory[i];
        let currPos = this.posHistory[i + 1];

        let posChange = p5.Vector.dist(prevPos, currPos);
        if (posChange >= this.p.width || posChange >= this.p.height) {
          continue;
        }
        this.p.line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    }
    super.display(dinstingDirection, mouthSize);
  }
}