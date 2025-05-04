---
tags: 'chap1'
script: '/assets/scripts/chap1_02.js'
id: 'sec2'
permalink: false
---

### 1.3.2 Vector implementation:

To create a of vector object (which is called **p5.Vector** internally in **p5**) we use:  
let vec = `createVector(30, 200)`   
Thus vec represents the position vector pointing from the origin to $(30, 200)$

*Basic Vector operations:*  
Where v1, v2 are vectors and a is a real number

- $v_1 + v_2$ : `v1.add(v2)`  
- $v_1 - v_2$  : `v1.sub(v2)`  
- $a*v_1$ : ` v1.mult(a)`  
- $1/a * (v_1)$ : `v1.div(a)`
- $||v_1||$ : `v_1.mag()`  
- $(v_1) / ||v_1||$ : `v1.normalise() ` 
- Random vector from unit circle - ` p5.Vector.random2D()`


Note that in `v1.function()` , `function()` is called as a method of the class. Any name that appears as v1*.name* is a property of the class that v1 represents, the ‘ . ’ allows us to access those properties - thus we are able to call methods like `add()` since they belong to the p5.Vector class. To view all the methods please check the [p5 reference](https://p5js.org/reference/p5/p5.Vector/).

### 1.3.3 Physical entities and classes:

We will implement physical entities (i.e., laws of physics obeying objects)  with the help of a Mover class - Classes are how we define a new type of object in **js** and give it structure - with its own properties and functions. 

Below is an example of how the class is implemented, where we are trying to simulate a ball, bouncing around in an enclosed space. Parameters and characteristics of the simulation are:

1. Canvas size - $500 \times 400$ - chose so that the ball may hit the edges more often  
2. Initial velocity \= $(3, -2)$ px/f -roughly simulates just tossing a ball towards a wall  
3. Collision with walls, floor - inelastic in nature

The constants \- friction coefficient, gravitational acceleration, percentage of energy lost in after wall-collision are all chosen after experimentation with the visualisation produced by each of these quantities.   
The mass of the object is an arbitrary quantity \- only there to determine the size of the object and scaling of gravitational force. Note that we increase the gravitational force for heavier objects, in order to simulate what we see in usual environments \- heavier objects fall faster relative to lighter ones (although this isn’t because of gravitation but rather other external forces like air resistance). 

This is the basic structure of our class:  
```js
// Program to simulate a bouncing ball under the influence of gravity and frictional forces
class Mover {
  /* This is the syntax for creating a class, now within this block 
  we can define and attach properties and functions (methods) to the class
  by using the 'this' keyword */

  // The constructor sets the initial values that are required after instantiation
  // for the Mover class we require, x and y coordinates, and mass of the object

  constructor(x, y, m) {
    // The velocity chosen such that it showcases all the features of the program

    this.pos = createVector(x, y);
    this.vel = createVector(2, -3);
    this.acc = createVector();    // Creates a vector of default values (0,0)
    this.mass = m;
    this.r = m * 0.875;   // Object radius ∝ mass - i.e., assuming bigger ⇒ heavier
    this.D = this.r * 2;    // Diameter - used as argument for drawing circle
  }

  // Inside classes, function/methods don't need the 'function' keyword,
  update() {
    // The below three lines implement the physical laws as sequenced in the modelling section
    // This implementation will be used throughout all simulations as part of the update() method

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);       //Acceleration is reset - only affected by force(s) at that frame

    // bounceEdges() is called after the reset, since the effect of friction
    // applied in bounceEdges() is only used in the next frame 
    this.bounceEdges();
  }

  show() {
    circle(this.pos.x, this.pos.y, this.D);
  }

  applyForce(force) {
    // Since gravitational acceleration is constant, we have to create a copy
    // And apply second law to the copied vector
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }

  bounceEdges(fric_Force = true) {
    if (this.pos.y + this.r > height) {
      this.vel.y *= -0.85;
      this.pos.y += height - (this.pos.y + this.r);

      if (fric_Force) {
        // Formula used is fric = µN (-û) where 
        // µ - frictional coeffecient, N- Normal force, û - unit vector along current velocity 
        // Basically friction is a force acting along the opposite direction of the velocity

        let fric = p5.Vector.setMag(this.vel, fric_coeff); 
        fric.mult(-1);
        this.applyForce(fric);
      }
    } else if (this.pos.y - this.r < 0) {
      this.vel.y *= -0.85;
      this.pos.y -= this.pos.y - this.r
    }

    if (this.pos.x + this.r > width) {
      this.vel.x *= -0.95;
      this.pos.x += width - (this.pos.x + this.r);
    } else if (this.pos.x - this.r < 0) {
      this.vel.x *= -0.95;
      this.pos.x -= this.pos.x - this.r;
    }
  }
}

let mv;   // The mover instance decleration
let gravity;
const fric_coeff = 0.075;

function setup() {
  createCanvas(400, 400);
  fill(100);
  gravity = createVector(0, 0.1);
  mv = new Mover(200, 80, 20);

}

function draw() {
  background(220);
  mv.show();

  // Applying any universal forces in the simulation - in this case just gravity
  // But since grativational force actually scales according to mass, we pass a new vector at each frame
  // i.e., our constant gravity vector multiplied by the mass of the mover
  mv.applyForce(p5.Vector.mult(gravity, mv.mass));


  mv.update();

}
```

This structure serves as a template for any kind of moving object - a method to display our mover, a method to update its position - using the 2^nd^ law, and other methods that take care of detecting and processing forces. 

This is how an instance of the object is made and used in our sketches:
```js
let mv;   // The mover instance decleration
let gravity;
const fric_coeff = 0.075;

function setup() {
  createCanvas(400, 400);
  fill(100);
  gravity = createVector(0, 0.1);
  mv = new Mover(200, 80, 20);

}

function draw() {
  background(220);
  mv.show();

  // Applying any universal forces in the simulation - in this case just gravity
  // But since grativational force actually scales according to mass, we pass a new vector at each frame
  // i.e., our constant gravity vector multiplied by the mass of the mover
  mv.applyForce(p5.Vector.mult(gravity, mv.mass));


  mv.update();

}
```

Where `mv = new Mover(200, 80, 20)` is the syntax to create an object of type Mover and $x = 200$, $y = 80$ and mass $= 20$ is passed to the constructor, which then creates all the initial required values.

Now the main method, that takes care of processing forces \- is applyForce()  
```js
  applyForce(force) {
    // Since gravitational acceleration is constant, we have to create a copy
    // And apply second law to the copied vector
    let f = p5.Vector.div(force, this.mass);
    this.acc.add(f);
  }
```

Here `p5.Vector.div()` is a static method. Static methods are used when we want to return a new instance of the Class using an already existing instance (here f is used) over manipulating property values of that particular instance ( then we will use `f.div()` ). 

The secondary method of our Mover class is the `bounceEdges()` method. It checks if at the next frame or the updated position before displaying is beyond the edges of the screen. If so, it repositions the object right at the edge, and reduces the velocity to simulate a inelastic collision 

```js
  // Implementation of above logic
  if (this.pos.x + this.r > width) {
      this.vel.x *= -0.95;
      this.pos.x += width - (this.pos.x + this.r);
    } else if (this.pos.x - this.r < 0) {
      this.vel.x *= -0.95;
      this.pos.x -= this.pos.x - this.r;
    }

```
and if the edge is the lower one (floor) then, we also inform my Mover, that frictional force must also be added, along with the other forces in the next frame through `this.applyForce(fric)`.^4^

```js
bounceEdges(fric_Force = true) {
  /*
  code from prev block goes here
  ...
  */

  if (this.pos.y + this.r > height) {
    this.vel.y *= -0.85;
    this.pos.y += height - (this.pos.y + this.r);

    if (fric_Force) {
      // Formula used is fric = µN (-û) where 
      // µ - frictional coeffecient, N- Normal force, û - unit vector along current velocity 
      // Basically friction is a force acting along the opposite direction of the velocity

      let fric = p5.Vector.setMag(this.vel, fric_coeff); 
      fric.mult(-1);
      this.applyForce(fric);
    }
  }
}
```

In the above snippet, similar to `p5.Vector.div()`, here `p5.Vector.setMag(this.vel, fric_coeff)` - takes the the velocity of our object, and scales the magnitude to be fric_coeff. 

Putting it together we get this :)

{% include "simulation-grid.html" %}

## Notes:

1. Using a circle would also simplify calculations to do with contact \- enables us to ignore surface area in calculations we do. 

2. Although the scope of the nuances behind this claim is beyond this thesis, according to the current knowledge of visual processing, the information of shape, depth, colour and motion are handled separately and finally seen as an image to us. The speed at which this information can be processed therefore limits the ability to distinguish between two still images and one continuous motion. And this line seems to be drawn at around 10 to 12 images per second (i.e. 10-12 fps).   
   But the kind of motion we see depends on intensity and frequency of sustained light and length of darkness  
     
   This is one of the numerous tricks that simulation uses \- where the fundamental limits of ourselves help in decreasing required precision and therefore reducing computational overheads whenever possible. One can think of this as also discovering the required parameters of our simulation so that we can simulate real life-like motion to the extent needed. One more technique that makes use of the limits of our eye is anti-aliasing \- allows us to define and use real coordinates in a discrete world
     
3. Note that pixels in various contexts mean different things, but CSS sets a standard definition of relative pixel dimensions, which is used in **JS** and hence **p5.js** as well. Relative means that \- if object travels 5 px/frame \- regardless of absolute pixel resolution of two different monitors \- it will cross a canvas of width 400 px in 80 frames
4. Multiple other implementation orders were tried, but this is the one that with simplest, small code and the one that makes sure friction is only applied once when the ball is close to the ground