---
tags: 'chap2'
script: '/assets/scripts/chap2_01.js'
id: 'sec1'
permalink: false
---

## 2.1 Phenomena

Attempting to capture the randomness we see around us in a finatry, computational world is of deep interest. This does not disclude motion simulation. From trying to parameterize microbial environments to understand motion of bacteria^1^, to creating a background scene of moths swarming around a light source in the night, the ability to produce randomness (or more precisely *pseudo-randomness*) is of vast use from the microscopic to the macroscopic world. 

In motion phenomena, when one does not know of all the conditions that lead to a certain outcome, or one simply cannot model all the parameters - randomness is often introduced as a substitute. For example: modelling passing of genetics from parents. It is usually modelled as randomized selection of traits from either parent and changing the traits by slight perturbations - a substitute for evolution.  

Therefore modelling and understanding how randomness is simulated is a crucial step in moving towards more complex natural phenomena. In this project, we will do this by trying to simulate different kinds of random walks - with varying underlying distributions and parameters.

## 2.2 Modelling

All things related to representation and motion will remain the same in terms of modelling for this chapter (and the remainder of the project). The only difference of a *deterministic* motion phenomena to a *stochastic* one, is that the position of our mover (or ‘walker’ in this chapter) will be updated randomly - according to some probability distribution, as compared to external forces in the environment.^2^ Therefore the `update()` method now will look like

```
update(){  
    applied quantity = rand_function(p1, p2,...)   
    // Do calculations to go from applied quantity to position  
      
   new pos = 𝑓( applied quantity [, old pos] )  
}
```

Here, rand_func is either a built-in function - in __JS__, the __p5__ library^3^ ^4^, or a function made by ourselves  that samples from particular probability distribution. The applied quantity, is either magnitude or direction of the next step which can be modelled as a velocity vector but not always done so. 

**Direction**: then the angle is randomly generated and we derive velocity from the angle, with some set magnitude.  
**Magnitude**: then the x-coordinates and y-coordinates are randomly generated and added to the current position. Or randomly generate a scalar value to be multiplied to a given velocity

Of course, affecting one parameter of motion usually affects the other and a random walk with constant direction but varying magnitude is not useful (unless in 1D). Hence, picking x and y coords would also usually ensure the direction changes as well. Hence, it is through combining them with different distributions and/or varying them separately (like constant magnitude and varying direction) we create different simulations of a random walk. 

## 2.3 Implementation

### 2.3.1 Basic random walker

The basic walker is implemented without vectors, and hence, just adding changes to the current position each frame is how we implement it. The change is precisely what our applied quantity is and the random distribution is, uniform over the unit-square.

 
The rand_func here is `random(a,b)` returns a uniformly distributed sample from the range $(a,b)$
``` js
/* A 2D random walk performed by a point object on a screen (Random Walker)
The Probability distribution taken for the RW is Uniform(-1,1) - separately for the x-value and y-value*/

class Walker {
  //This is the class for the RW
  constructor() {
    //we are placing the walker at the center of the screen
    this.x = width / 2;
    this.y = height / 2;
  }

  display() {
    //Displays the walker at the given location
    stroke(0);
    point(this.x, this.y);
  }

  update() {
    //Changes the location of the walker randomly within a unit square of the current location
    this.x += random(-1, 1);
    this.y += random(-1, 1);
  }
}

let w;

//Global functions inbuilt in p5.js, setup() runs once and draw() runs repeatedly
function setup() {
  createCanvas(700, 500);
  //Creating an instance 'w' of the of the class Walker
  w = new Walker();   
  background(255);
}

function draw() { 
  w.display();
  w.update();
}
```
And this is the output simulation

{% include "simulation-grid.html" %}

Although the implementation is different from expected from the previous section and chapter, the ideas are the same.  
The main difference being the representation of our walker is a point - this is because it makes it easier to see the minute changes that happen to the walker each frame  
Secondly, the other change is that we do not refresh our background is not refreshed every frame, instead we let the walker's previous position be visible throughout the sketch - all we are doing is just colouring a pixel black if the walker has passed through it.  This is a similar adoption to how they are usually represented, although we will eventually switch to our usual motion representation (*‘animated’* style) as we won’t be trying to model random walks, but walkers that possess random movements.^5^ 