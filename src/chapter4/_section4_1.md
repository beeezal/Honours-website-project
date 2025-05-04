---
tags: 'chap4'
script: '/assets/scripts/chap4_01.js'
id: 'sec1'
permalink: false
---

## 4.1 Phenomena

So far we’ve only been dealing with motion phenomena that are either random or are controlled by external factors like user input or forces. But living beings not only have agency to move, but also are purpose-driven. This is what we usually mean when we say life-like motion.

For example, take a scenario where a sheep has left its herd managed by a cowboy. This is our external stimuli. Now the cowboy would like to retrieve the lost sheep (the goal). So he would get on his horse and steer the horse through the terrain, both avoiding obstacles and moving towards the sheep as fast as possible. Then the movement of the horse, where the autonomy of its movement comes from the cowboy is life-like motion [Reynolds 99]

Similarly, imagine a gazelle that is hungry (internal stimulus) in an open plain field. The movement of the gazelle about the field would reflect its desire to find and eat grass. And suppose a cheetah is nearby and the gazelle realises it. Now in order to survive the gazelle moves differently compared to when it was grazing.

Therefore, to simulate such motion phenomena is essential.  That is we want to simulate entities that move in response to stimuli and/or an internal goal - agents that are autonomous in nature. A fundamental characteristic of such agents is that it does not know the exact path to take in order to achieve its goal(s). But rather at each instant of the situation / environment it is in, it will actively decide to move according to its goal. 
For eg: the gazelle when evading the cheetah might be running straight for some time, but then suddenly turn, if it is a better option at that instant. 

This characteristic of autonomous behaviour will be the basis, in our attempts to simulate such behaviour.

## 4.2 Modelling

### 4.2.1 Defining Autonomous Agents

As described in the previous , and from the name we can derive an intuitive definition that an entity that has both autonomy and agency is an autonomous agent (AA). They are entities that have the ability to act and react in its environment, independent of any external control or intervention.

Now, the ability to act and react, means to change some state of the environment - be itself or some other component. Which requires two things:

The ability to perceive at least some part of the environment - in order to react, the agent would first have to make some observation. When the agents are enabled for physical motion, this also implicitly implies that there are components other than the agent itself in the environment.^1^

The second is not always a necessary requirement, but given the context of motion phenomena / behaviours, the agent must be a part of the environment in order to act (move) in it.

In order to differentiate between the AA of this project and a general AA, a classification must include these characteristics of our autonomous agents. Following suit of [Reynolds 99], we then classify our agents as,

**Isolated or Situated**:

An agent is situated when there are other entities along with the agent in the environment. In other words, there is ‘something’ outside of the agent that is also part of the environment. This property enables the agent to interact with the environment. A chatbot, whose entire environment is its own screen (where all inputs are made part of the bot) is an isolated agent. A power grid controller is a situated agent, along with many other components of the grid

**Embodied or Abstract**:

Embodiment essentially refers to the second requirement mentioned previously. It is the physical existence of the agent within the environment. For example, an email bot which filters out important and spam emails from your inbox need not have a physical presence, but is rather activated through some command / situation. Meanwhile, a vacuum cleaning robot can clean the environment (house) precisely because it exists in it.

**Reactive or Deliberative**:

The difference between reactive and deliberative agents lies in its ability to reason and think about the response to given stimuli. The former does not possess such abilities - response is an immediate output, while the latter deliberates and learns to optimise its output.

### 4.2.2 Further Classification of our Autonomous Agents

Clearly, since we are handling autonomous agents that possess motion behaviours, our agents will fall under the categorisation situated, embodied and reactive. Here, by motion behaviour, we refer to the life-like motion of our entities.

To further break down the process of simulating motion behaviours in autonomous agents, we use a model that contains three stages: action selection, steering behaviour and locomotion. Using the examples from  let's look at how these individual stages look.

**Action Selection** : 
Involves goal setting, prioritizing in response to the environment. For the cowboy this was to pursue/find the sheep. For the gazelle, this was to eat when hungry and run away when chased by a cheetah. 
For most cases, we will consider the chase and the grazing as two different simulations, but in some instances we will also look at combining these two behaviours and prioritize one over the other - when there is lack of threat the gazelle can focus on grazing, but when the cheetah is observed to be within some distance then the gazelle would prefer living over die eating, and hence prioritize running away.

**Steering behaviours** :
Involves path determination for the given goal. i.e., where to move in order to achieve the needs of the agent. Towards the stimuli - cowboy, or Away from the stimuli - gazelle, randomly - gazelle (while grazing). 
In our models, all this boils down to calculating a Steering force (vector) according to which the agent will move to a new position (as modelled in ). This steering force takes into account two things - the current velocity and the desired velocity (which is selected according to the agent’s goal) [Reynolds 1999]. 
Then the steering force is just the amount of force (and therefore acceleration) that should be applied in order to change our velocity from the current towards the desired.

**Locomotion**:
Involves the _embodiment_ of the agent itself - physical appearance, visualisation of steering behaviour, animation. Eg, the cowboy’s instruction to speed up can either be implemented to the horse by dynamic joints and muscles which will go from walking to galloping - simulating realistically the legged motion. 
Or one can also simply animate a sequence of frames to provide the illusion of motion.

But since the focus of this section is on _autonomy_ itself, as long as the viewer is able to observe and agree that the motion (i.e., the change in position each frame) is perceived to be _autonomous_ it does not matter what the actual mechanics of that motion is.

Therefore, we will - as done till now - work with a circle, as an abstracted embodiment of our agents.

## 4.3 Implementation

First we shall implement the overall characteristics common to all agents of different motion behaviour by an abstract class AutonMover - which itself doesn’t contain a specific motion behaviour.

### 4.3.1 Implementation of the SER Characteristics:

Situatedness and Embodiment have already been built into our simulation. The agent becomes situated as soon as we define our canvas and initiate our agent in setup() as such:

`agent = new AutonMover(x, y, r)`

Embodiment follows from the properties assigned to the agent at construction - the size, initial velocity, acceleration and position of the agent.

```js
class AutonMover {
  constructor(x, y, r) {
      this.r = r;
      this.D = r * 2;   //Diameter of the particle - used in defining shapes 
      
      this.pos = createVector(x, y);
      this.vel = p5.Vector.random2D();
      this.acc = createVector(0, 0);
  ...
  }
...
}
```

In order to be a reactive agent, it needs to both perceive parts of the environment (take in input) and also have a reaction process according to its input (produce output). This will be done through methods of the class. For eg:

```
  seek( target ) {
    Do some calculations
    return output
  }

  avoid( [objects] ) {
  ...
  }
```

Where ‘target’ and ‘[objects]’ are inputs that the agent takes from the environment1. And the output is the calculated reaction - which in our case is a steering force. 

Now since, all our simulations of autonomous agents, will not handle gravity, friction and other external forces. The only part that concerns the use of physical laws is the calculation of new positions. Therefore, to simplify our code, let’s assume that $m = 1$, then

$$ΣF = a$$

Which changes the calculation of acceleration in `applyForce()` to just adding the force to acceleration.

```js
  applyForce(force) {
    this.acc.add(force);
  }
```

This also implies, in order to calculate an acceleration to change our velocity from current to desired, is same as calculating the steering force, therefore:

``` 
steering force = desired velocity - current velocity 
```

The above equation is the common for all agents regardless of how the desired velocity is calculated (i.e., what behaviour we are dealing with), so we shall implement a method `steer()` in AutonMover that calculates and applies the steering force:

```js
  steer(){
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce);         

    this.applyForce(steer);
  }

```

### 4.3.2 Implementation of the 3 stages of motion behaviour:

**Action Selection**: Is implemented through classes. Since action selection is the base guide for differentiating between motion behaviours, for each kind of behaviour, we will take all the common features of AA from the AutonMover class and extend on it including method(s) unique to the class for implementing the specific behaviour2. 

The above notion of extension is implemented in **JS** as *Class Inheritance*, the syntax:

```
Behaviour1_Agent extends AutonMover{
  ...
  behaviour(parm1, param2, ...){
  }
  ...
}
```
Now when calling upon the properties of `Behaviour1_Agent`, one can also call the properties of the parent class `AutonMover`, with the same syntax.

i.e., when we call `Behaviour1_Agent.pos`, the compiler will first look for `pos` defined in the current class and if not found, it will look for it in the parent class, and return that value.

**Steering behaviour**: Is implemented as the `steer()` function mentioned above. Also since desired velocity is a part of our agents that is constantly used and calculated, we will make it a property - `desired_vel` initialized during construction in `AutonMover`.

**Locomotion**: Includes all things implemented for embodiment characteristic for visualisation of our agent in our environment. One further visual element that would be useful is incorporation of current velocity in the circle, i.e., emphasis on the current direction. This can be implemented in several ways with the help of `push()` and `pop()` functions^3^. For this we shall implement a dynamic mouth animation - which shall open and close in a rhythmic oscillatory fashion.

```js
display(dinstingDirection = false, mouthSize = PI / 10) {
  if (dinstingDirection) {
    push();
    fill(100);
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    let lowerLip = mouthSize / 2 * sin(frameCount * 0.1) + mouthSize / 2;
    arc(0, 0, this.D, this.D, lowerLip, TWO_PI - lowerLip, PIE);
  }
  else {
    //Draw a circle at the current location (x,y) with radius r = D/2
}
```

The implementation idea is obvious after one observes that `arc()` parameters are, $x$ position, $y$ position, width, height, start, stop respectively. Where the arc is drawn at $(x,y)$ with size **(width x height)** and the arc starts from start and ends at stop clockwise (where both are in radians). In order to animate the mouth, we just use `sin()` function’s output with the input as `frameCount` and scale it to $[0,$ mouth\_size] from $[-1, 1]$.^4^

Other considerations of locomotion are also the physical limitations that we would like the agent to exhibit, similar to how it would in real life. Since steering force is an internal property and not external, it would have a maximum possible value which depends on the mechanisms according to which we assume our agents to work with. For example if the mode of locomotion is a car - then the value would be limited according to the maximum energy produced by the engine and the sturdiness and turning gear of the tires. Else if it is an animal - then the value would be dependent on muscular strength and power.

In order to impose those qualities within our abstract implementation, we introduce the maxForce property - which limits the maximum magnitude, as seen in l2 of steer(). Similarly to avoid our velocity magnitude from taking extreme values and to set a base value for the desired velocity’s magnitude, we introduce the maxSpeed property. This concludes, all required properties of our AutonMover class,

```js
class AutonMover {
  constructor(x, y, r) {
    this.r = r;
    this.D = r * 2;                  //Diameter of the particle - used in defining shapes 
    
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D();
    this.acc = createVector(0, 0);
    this.desired_vel = createVector();


    this.maxSpeed = 5;
    this.maxForce = 0.125;


    this.posHistory = [];
    this.showHistory = true;
  }
  /* All the other methods like seek() and applyForce() etc., follows */
```

Note, the use of `posHistory` and `showHistory` will be explained in [4.3.4](#434-comparing-implementations-of-random-motion-behaviours)

### 4.3.3 Implementing specific autonomous behaviours

#### Seeking behaviour:

As mentioned, all agents’ implementation is an extension of the AutonMover class, the extension being only the implementation of a particular behaviour.^5^ Therefore we shall only going forward mention those extended methods, and assume all other things the same, unless mentioned otherwise.

For a seeker:

Goal / Selected action: To chase a target object (stationary or moving)

Steering behaviour / Desired velocity calculation : towards the object at maxSpeed

Implementation:

```js
seek(target){
  this.desired_vel = p5.Vector.sub(target, this.pos);
  let distance = this.desired_vel.mag();

  this.steer();
}
```

Right now, although the seeker is aware of the position of its target, it doesn’t have a perception of **depth/distance**, and therefore it overshoots the target once it reaches. We can include this in our implementation by adding a distance check using **distance**.`mag()` and scale our desired velocity to slow down once close by target.^6^ We implement this by adding an extra boolean parameter to our seek function - `arriving_bhv` - if true, then we run extra extra code in `seek()` - within the if block.

```js
seek(target, arrive = false){
  this.desired_vel = p5.Vector.sub(target, this.pos);
  let distance = this.desired_vel.mag();
  
  // Added code
  if (arrive && distance < 100){
    let desiredMag = map(distance, 0, 100, 0, this.maxSpeed);
    this.desired_vel.setMag(desiredMag);
  }
  else{this.desired_vel.setMag(this.maxSpeed)};
  //End of added code

  this.steer();
}
```
Now you have a simulation of an seeker that can choose to have depth-perception:

{% include "simulation-grid.html" %}

The above example also subtly hints on the relationship between the input to the agent and the output. i.e., the amount of sophistication the agents’ steering behaviour has is proportional to the amount of information the seeker can perceive and process from the canvas.
