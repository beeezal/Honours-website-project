---
tags: 'chap1'
script: '/assets/scripts/chap1_01.js'
id: 'sec1'
permalink: false
---

The aim of this chapter is to introduce the basics of 2D animation provided by the **p5.js** library, through examples of simple deterministic motion. This will be the foundation of motion simulation that I will be discussing for the rest of the project. 

## 1.1 Phenomena

One of the most important and elementary features of life is the ability to move. Therefore it is essential for us to be able to simulate entities moving across the screen (our environment). But before simulating complex life-like motion, let us first simplify the problem to simulating simple motion \- like an object moving along a straight line. This allows us to understand the modelling and implementation of simulating motion in our **p5** sketches (these are explained further below) and extend the ideas to any kind of motion simulation. 

We will build our simulations in this chapter around one of the key ideas of classical mechanics \- Forces. We also ask the question: how does the existence of external forces such as gravity, air resistance, drag and friction affect the motion of inanimate objects? Further, how can we define such characteristics in our virtual environment such that the resulting simulations are akin to that seen in the real physical world? These are two sides of the same coin that we will continue to explore \- break down phenomena into simple pieces by coding and picking out important parameters of the phenomena from the code.

Viewing motion simulation in such a manner allows us to move smoothly from simple animations, i.e. motion of an object in a straight line or a stationary object, to simple but naturally occurring physical phenomena, such as a ball being dropped to the ground from some height under the influence of gravity, parabolic motion of a thrown object, etc.

And finally the one shown below may not be a naturally occurring phenomenon, but to justify its implementation in code, I state the following: have we all not played around with a bouncing ball \- throw it at a particular angle and see what reaction we get from the ball and its interactions with the wall, floor and household objects. Therefore, it's a simple yet an informative experiment to see the influence of gravity, collision and friction on a moving object. 


## 1.2 Modeling

First, in order to simulate the effect of forces on an object, we need to represent the object in our virtual environment \- the screen \- or the **p5** canvas (or just canvas). To simplify the physics \- hence shortening code lengths, and to simplify the visualisation of our object, we will use a circle to represent our object and will be considered to be a point-mass object (where all the mass is concentrated at the centre)1

Now that we have the canvas (environment) and the circle (entity/object), we also need to represent time. This is done through redrawing on our canvas every frame.   
For example, let’s say we initially draw the circle at the centre of canvas, then we would erase that drawing and draw the circle again a little bit to the right, repeat this a few times moving the circle a little bit to the right each time. Now show each of these drawings one by one at a particular speed (i.e. frame rate). If the speed is fast enough and the change in position is close enough, then voilà\! You have your circle moving from left to right seemingly continuous to the eye.  
This is precisely how animated motion pictures are made, and one can think of this as the digital analog. Note that this method of simulating motion is not something that has magically appeared, but from our intuitive understanding of motion in terms of displacement. 

Displacement is just the change in position over time. Now, of course, in order to move to the continuous world, we would have to take limits of the change (in position) and derive the velocity **at every instant**, but that is impossible since the continuum is uncountable (i.e., you can never complete calculating velocity at ‘every instant’). But such instantaneous calculations are unnecessary for all practical purposes, since our brain cannot tell the difference visually between a continuous motion over 2 seconds versus many discrete steps of motion over 2 seconds^2^. Now, since it is in every frame that we change the position of the object, a convenient and natural **unit of time is the frame rate**. Similarly, since we also change the position of our object in terms of pixels3, we will consider the unit of distance to be pixels (or px). Thus any mention of value without attached units must be interpreted respectively. E.g. speed \= $5$ , means that we are setting the variable ‘speed’ to be $5$ px/f

### 1.2.2 Modelling of physics:

The topic of physics we are engaging with \- dynamics in 2 dimensions \- uses both magnitude and direction to describe motion phenomena. Therefore, following suit with the usual textbook method of modelling these dual-parameter notions, we shall use vectors, since we are also already using a Cartesian plane to describe the position of entities.

Vectors are not only a useful tool to quantify relative position, through vector subtraction, but also a compact way of describing change. There are two ways in which we represent these vectors - Cartesian and Polar coordinates - either might be used depending on the situation and perspective required.

For example, if I have to move from point A to B, we first embed the positions of A and B, as vectors relative to the origin - which is already given to us in the usual Cartesian representation.   
Now all we have to do is find out the units along the $x$-axis (let’s call it $x$) and the no. of units along the y-axis is B from A (this can also be done through vector subtraction of the position vectors of A and B). Now the vector $(x,y)$ precisely holds the information about how far and in what direction is B from A. 

(Intend to add a diagram, that shows how two vectors are added and subtracted)

Therefore, a simple vector addition of $(x,y)$ to the position vector A is how we will linearly move an object from A to B in one frame.   
But, suppose the two points A and B are much further apart, and we want to only reach B in 200 frames then we can scale down the magnitude of $(x,y)$ by 200 - using scalar multiplication to get $(x’, y’)$, then $(x’,y’)$ is precisely the velocity vector, therefore simply by adding $(x’,y’)$ to the current position vector at each frame - and setting the resultant vector as the new position vector for the next frame - we can produce a simulation / animation of an object moving from A to B along a straight line. 

Similarly, any other quantity in motion phenomena that has both magnitude and direction will also be represented through vectors in our simulations.   
This also allows manipulation and interaction of these different quantities - force (Gravitation, friction), acceleration, velocity, position through the means of vector addition, subtraction and scalar multiplication as follows:

In one frame (1 unit of time) given that our object is at current position, current velocity

1. Suppose we have external forces $f_1, f_2$, then by the second law of motion, we have:  
   acceleration = ($f_1 + f_2) / m$ \= sum of external forces / mass

2. (New Velocity - Current velocity) / time = acceleration, which implies  
   New velocity = Current velocity + Acceleration

3. Similarly, New position = Current position + new velocity

4. Draw our next frame with the object in New position, and repeat from 1. unless explicitly stopped

The above method is commonly known as Euler Integration, although it is not the most accurate method that is used for describing continuous motion, it is good enough for the motion phenomena that were simulated for the project. This is mostly because our major requirements are smoothness - visually, and easy implementation - computationally.   
It is likely that the above conditions are met because the change in quantities over each frame is relatively small, the errors - and hence the departure from real-life behaviour is visually minimal.

(Intend to add a picture that shows difference between curve that results from Euler-integration and the actual integral curve - and see what happens when step size is small)

Therefore, the above sequence works as a model of simulating dynamics of physical objects - with an explicit usage of the 2^nd^ law, and an implicit use of the 1^st^ law of motion - where an object’s velocity will not change unless an external force acts on it. 

The choice of using forces active in every frame to compute a new position for the next frame, allows us to model multiple kinds of forces, within the same structure (the loop). Eg: constant forces in the environment - gravity, changing forces in simulation - wind force, activated forces under condition - friction, buoyancy. 

## 1.3 Implementation

### 1.3.1: Moving object along a straight line 

To draw a circle at the position $(x,y)$ with diameter d on our canvas, we use the built-in **p5** function `circle(x, y, d)`
```
function setup(){  
    createCanvas( windowWidth, windowHeight );  
    background( 225 );  
    circle(10, 250, 50);  
}
```

Now to move the circle from the centre of the screen (width/2 height/2) to say 400 px to the right then we write the following code  
  
```js
let x_coord
let y_coord 
let timeTaken
let speed

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  fill(100);

  x_coord = width/2;
  y_coord = height/2;

  // Change the time taken here (in #frames), to see how it affects the animation
  // Note that this implementation is not used in our simulation below
  // This is just to show other ways of input that is possible
  timeTaken = prompt("Enter the time taken (in px) for the circle to move", 400);
  speed = 400/timeTaken

  circle(x_coord, y_coord, 20);
}

function draw() {
  // If condition used here to stop the draw loop() after we have arrived at our destination
  if (x_coord <= width/2 + 400){
    background(255);

    // Since we are only moving along x-axis, we can ignore the y-coordinate
    x_coord += speed;
    // If we want to move to a location that is not along either axis relative to initial position
    // Then we would have to calculate the slope of the line joining the locations and
    // use that to manipulate the y-coord i.e., 
    // y_coord += slope * speed;   [where slope = change in y / change in x]

    circle(x_coord, y_coord, 20);
  }
  // `noLoop()` will stop the draw loop
  else{ noLoop(); }
}
```
{% include "simulation-grid.html" %}