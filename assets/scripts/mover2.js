class AutonMover {
  constructor(p, x, y, r) {
    this.p = p; // Store the p5 instance
    this.r = r;
    this.D = r * 2; // Diameter of the particle - used in defining shapes 

    this.pos = this.p.createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = this.p.createVector(0, 0);
    this.desired_vel = this.p.createVector();

    this.maxSpeed = 5;
    this.maxForce = 0.125;
    this.lifespan = 600;
    this.desiredSeparation = this.D * 1.25;
    this.neighbourDistance = this.D * 3;

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
      // Save local state and draw an oscillating mouth animation 
      // To visualise the direction of motion
      this.p.push();
      this.p.fill(100);
      this.p.translate(this.pos.x, this.pos.y);
      this.p.rotate(this.vel.heading());
      let lowerLip = mouthSize / 2 * this.p.sin(this.p.frameCount * 0.1) + mouthSize / 2;
      this.p.arc(0, 0, this.D, this.D, lowerLip, this.p.TWO_PI - lowerLip, this.p.PIE);
      this.p.pop(); // Return to original saved state 
    }
    else {
      // Draws a circle at the current location (x,y) with radius r = D/2
      this.p.fill(100);
      this.p.circle(this.pos.x, this.pos.y, this.D);
    }
  }

  steer() {
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce);

    return steer;
  }

  separate(entityArray) {
    let count = 0;
    this.desired_vel.set(0, 0);

    for (let otherAgent of entityArray) {
      let diffVector = p5.Vector.sub(this.pos, otherAgent.pos);
      if (otherAgent !== this && (diffVector.mag() < this.desiredSeparation)) {
        diffVector.setMag(1 / diffVector.mag());
        this.desired_vel.add(diffVector);
        count++;
      }
    }
    if (count > 0) {
      this.desired_vel.setMag(this.maxSpeed);
      return this.steer();
    }
    return this.p.createVector(0, 0);
  }

  cohere(entityArray) {
    let count = 0;
    let avgPos = this.p.createVector(0, 0);

    for (let otherAgent of entityArray) {
      if (otherAgent !== this && p5.Vector.dist(this.pos, otherAgent.pos) < this.neighbourDistance) {
        avgPos.add(otherAgent.pos);
        count++;
      }
    }

    if (count > 0) {
      avgPos.div(count);
      this.desired_vel = p5.Vector.sub(avgPos, this.pos);
      return this.steer();
    }

    return this.p.createVector(0, 0);
  }

  align(entityArray) {
    let count = 0;
    this.desired_vel.set(0, 0);

    for (let otherAgent of entityArray) {
      if (otherAgent !== this && p5.Vector.dist(this.pos, otherAgent.pos) < this.neighbourDistance) {
        this.desired_vel.add(otherAgent.vel);
        count++;
      }
    }

    if (count > 0) {
      this.desired_vel.div(count);
      return this.steer();
    }

    return this.p.createVector(0, 0);
  }

  update(chk_edges = false) {
    this.updateHistory();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (chk_edges) { this.checkEdges(); }
  }

  checkEdges() {
    // Checking if the walker has crossed the canvas edges, if so - wrap around
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

  isDead() {
    return (this.lifespan <= 0);
  }
}

class Seeker extends AutonMover {
  seek(target, arrive = false) {
    // Calculate the desired velocity
    this.desired_vel = p5.Vector.sub(target, this.pos);
    let distance = this.desired_vel.mag();

    if (arrive && distance < 100) {
      let desiredMag = this.p.map(distance, 0, 100, 0, this.maxSpeed);
      this.desired_vel.setMag(desiredMag);
    }
    else { this.desired_vel.setMag(this.maxSpeed); }

    return this.steer();
  }

  applyBehaviours(seekWeight = 0.5, sepWeight = 0.5, target = null, arrive = false, entityArray = []) {
    // Use a default target if none provided
    if (!target) {
      target = this.p.createVector(this.p.width / 2, this.p.height / 2);
    }
    
    let seekForce = p5.Vector.mult(this.seek(target, arrive), seekWeight);
    let separationForce = p5.Vector.mult(this.separate(entityArray), sepWeight);

    this.applyForce(seekForce);
    this.applyForce(separationForce);
  }

  display(dinstingDirection = false, mouthSize = this.p.PI / 10) {
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length - 1; i++) {
        let prevPos = this.posHistory[i];
        let currPos = this.posHistory[i + 1];

        let posChange = p5.Vector.dist(prevPos, currPos);
        if (posChange >= this.p.windowWidth || posChange >= this.p.windowHeight) {
          continue;
        }
        this.p.line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    }
    super.display(dinstingDirection, mouthSize);
  }
}