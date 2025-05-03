---
tags: 'chap2'
script: '/assets/scripts/chap2_02.js'
id: 'sec2'
permalink: false
---

### 2.3.2 Normal random walker

Rand_func = `randomGaussian()` - normally distributed with,  
         mean \= current direction and SD \= $π/8$

Applied parameter \= direction (through angle of velocity)  

```js
class WalkerNormal {
  constructor(x, y, r) {
    this.location = createVector(x, y);
    this.velocity = p5.Vector.random2D();  
    this.r = r;    
    this.D = this.r * 2;                       
    this.velAngle = this.velocity.heading();
		this.col = color(100)		// initialised with the grayscale value 100
  }
  
  display() {
		stroke(0);
    fill(this.col);
    // Displaying the step of the walker using a relatively thin line if step size is large
    // strokeWeight(this.r/3);
    // line(this.location.x - this.velocity.x, this.location.y - this.velocity.y,this.location.x, this.location.y);
    //Displaying the walker as a circle of radius r
    strokeWeight(1);
    circle(this.location.x, this.location.y, this.D);
  }
  
  update(vel_mag=1,chk_edges=false) {
    if (frameCount % 3 === 0) {
      // randomGaussian() returns a random sample from a N(0,1) 
      // Therefore by performing scaling and translation of the distribution we have 
      // the stepAangle is hence distributed according to N(current direction,π/8)
			
      this.velAngle = randomGaussian() * PI / 8 + this.velocity.heading();
			
      // Changing color if change in direction is more than 2 S.Ds (π/4 = 2σ)
      // color is set by choosing random RGB values
      if (abs(this.velAngle - this.velocity.heading()) >= QUARTER_PI) {        
        this.col = color(random(255), random(255), random(255));				
      }
    }
    this.velocity = createVector(cos(this.velAngle), sin(this.velAngle));
    this.velocity.mult(vel_mag);
    this.location.add(this.velocity);
		if (chk_edges){
			this.checkEdges();
		}
  }
  
  checkEdges() {
    //Function to check if the walker has crossed the canvas edges, if so - wrap around
    if (this.location.x > width) {
      this.location.x = 0;
    } else if (this.location.x < 0) {
      this.location.x = width;
    }
    if (this.location.y > height) {
      this.location.y = 0;
    } else if (this.location.y < 0) {
      this.location.y = height;
    }
  }
}

function windowResized(){
  //Function to resize canvas when window is resized - in other words, resize our sketch when windown is resized
  resizeCanvas(windowWidth,windowHeight);
  background(200);
}

let w;

function setup() {
  createCanvas(windowWidth,windowHeight);
	
  w = new WalkerNormal(width / 2, height / 2, 10);
  background(200);
}

function draw() {
  w.display();
  w.update(/*vel_mag*/ 3,/*chk_edgs*/ true); 
}
```

{% include "simulation-grid.html" %}

**Extra functionality**:

* checkEdges() \- works the same as bounceEdges() but instead of inverting the direction of motion, we now change the position of the object to the opposite edge.   
* Changing color of walker \- this is just to show visually the 68-95-99.7 rule \- to see the differences with other values of parameters in real time, [view here](https://openprocessing.org/sketch/2310776) 

