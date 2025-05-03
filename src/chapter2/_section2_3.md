---
tags: 'chap2'
script: '/assets/scripts/chap2_03.js'
id: 'sec3'
permalink: false
---

### 2.3.3 Square-distribution random walker

* Rand_func : `random()` - uniform distribution  
  - Applied parameter \= angle of velocity, range \= \[0, 2π\] radians and
* `randomSquared()` \- custom distribution, using *accept-reject* method  
  - Applied parameter \= magnitude, range \= $[0, 50]$ px

  ```js
  class Walker{                                    
    constructor(x, y, r) {
      this.location = createVector(x, y);
      this.velocity = p5.Vector.random2D();  
      this.r = r; 
      this.D = r * 2 
      this.sa = random(0,TWO_PI);    // sa = velAngle
    }
    
    display() {
      stroke(0);
      fill(100);
      // Displaying the step of the walker using a relatively thin line
      strokeWeight(this.r/3);
      line(this.location.x - this.velocity.x, this.location.y - this.velocity.y,this.location.x, this.location.y);
      //Displaying the walker as a circle of radius r
      strokeWeight(1);
      circle(this.location.x, this.location.y, this.D);
    }
    
    
    update(vel_mag=1,chk_edges=false) {
      if (frameCount%3==0){
        this.sa = random(0,TWO_PI);
      }
      this.velocity.set(cos(this.sa), sin(this.sa));
      this.velocity.mult(vel_mag);
      this.location.add(this.velocity);
      if (chk_edges){
        this.checkEdges();
      }
    }
    
    checkEdges() {
      if (this.location.x > width+this.r) {
        this.location.x = this.location.x - (width + this.r);
      } else if (this.location.x < -this.r) {
        this.location.x = width+( this.location.x + this.r);
      }
      if (this.location.y > height+this.r) {
        this.location.y = this.location.y - (height + this.r);
      } else if (this.location.y < -this.r) {
        this.location.y = height + (this.location.y + this.r);
      }
    }
  }

  function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    background(200);
  }

  function randomSquared(){
    //Function to generate random numbers with a x^2 distribution - using accept reject method
    let x = random();    // random number to be accepted
    let y = random();    // qualifying random number

    // P(y < x^2) is the condition for acceptance
    while (y>x**2){
      x = y;
      y = random();
    }
    return x;
  }

  let w;

  function setup() {
      createCanvas(windowWidth,windowHeight);
      background(200);

      w = new Walker(width / 2, height / 2, 3);
  }

  function draw() {
    w.display();
    let vel_mag =(frameCount%180==0)?randomSquared()*50:3;
    w.move(vel_mag, true);
  }
  ```

{% include "simulation-grid.html" %}