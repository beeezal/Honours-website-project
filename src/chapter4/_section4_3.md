---
tags: 'chap4'
script: '/assets/scripts/chap4_03.js'
id: 'sec3'
permalink: false
---

#### Wandering behaviour:

Selected action: 
Sustained-direction random walk^6^ - no erratic changes in direction of motion
Steering behaviour: 
Dependent steering force - small (random) change to the steering force from previous frame

Implementation:
Seeking a randomly changing point on a circle - whose center lie ahead of the agent

Since, we are extending upon the seeking behaviour implemented above, we shall extend our `Wanderer` Class from `Seeker`. Now, when the `Wanderer` is initialised we need a few more properties to be defined. Therefore in Wanderer’s constructor, we want all of Seeker’s properties and add on new ones. Just like `this` refers to the current class, `super` directly refers to the parent class, therefore:

```js
class Wanderer extends Seeker{
  constructor(x,y,r){
    super(x,y,r);

    this.wanderRadius = 40;
    this.predictionInterval = 100;    // How far ahead to draw the circle

    this.predictedPos = createVector(0,0);    // Vector from current position to predicted position

    // Since we are making random changes to the target position along a circle, 
    // we use the angle (b/w the target from the center and current direction) - and make small changes to it
    // i.e., we work with polar coordinates
    this.targetAngle=radians(random(0,360));    // Initialize to some random angle - same as random(0, TWO_PI)
    this.displayWanderCircle = true;
  } 
  ...
}
```

where the unexplained properties have the obvious interpretation from their names. The calculation of target is implemented as `calculateWandererTarget()`^7^

```js
calculateWanderTarget(){              
  this.predictedPos.set(p5.Vector.setMag(this.vel, this.predictionInterval));
  this.predictedPos.add(this.pos);


  this.targetAngle += random(-0.3,0.3);
  this.#target.set(p5.Vector.fromAngle(this.targetAngle + this.vel.heading(),this.wanderRadius)); // target = (θ, r) is in polar coords
  this.#target.add(this.predictedPos);
}
```

Now, because the `update()` in Seeker can already seek, all we have to do is input the internal target of the wanderer as the argument for target when calling like usual in `draw()`.^8^

( - without the randomRadius lines)

Finally, for understanding the implementation, by explicitly drawing the mechanics of the wanderer ( if `displayCircle = true` ) we call the method `displayCircle()`,

```js
  displayCircle(){
    //the circle is not filled with colour to avoid confusion with the actual mover
    noFill(); 
    line(this.pos.x,this.pos.y,this.predictedPos.x,this.predictedPos.y);
    circle(this.predictedPos.x,this.predictedPos.y, this.wanderRadius*2);
    line(this.predictedPos.x,this.predictedPos.y,this.#target.x,this.#target.y);
    circle(this.#target.x,this.#target.y,5);
  }
```

Therefore, updating our `display()` function to be:

```js
display(dinstingDirection = false, mouthSize = PI / 10){
  if(this.displayWanderCircle){
    this.displayCircle();
  }
  super.display(dinstingDirection, mouthSize);
}
```

**Implementing random Radius**:

* The wanderer’s motion for given parameters, though has sustained turning the circular movement seems to occur too often, hence its pattern of movement feels predictable relative to usual ‘random walks’ and the radius of this circular movement differs only by a small amount

* A partial attempt at resolving this is picking a random radius of the target circle at every frame (i.e., introduce a conditional into `draw()`), but still constraining to a minimum and maximum value - maximum being the obvious choice since the circle shouldn't intersect with `Wanderer` (then what would it mean to target something inside you!) and lower bound being visible enough

``` 
wanderer.wanderRadius = randomRadius ? constrain(wanderer.wanderRadius+=random(-2,2), 5, wanderer.predictionInterval-wanderer.r) 
                        : wanderer.wanderRadius;
```

{% include "simulation-grid.html" %}