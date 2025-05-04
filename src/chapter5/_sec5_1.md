---
tags: 'chap5'
script: '/assets/scripts/chap5_01.js'
id: 'sec1'
permalink: false
---

## 5.1 Phenomena
Even though we have been working with just individual agents till now, interactive behaviour where two or more entities/agents come together is a major part of natural phenomena, especially motion behaviours. There are many complex and emergent behaviours that can arise from simple individualistic behaviour.^1^

-   A prey-predator system - prey - deer - evader. Predator - cheetah - seeker
-   Predator-prey(s) system - preys - small fishes, predator - shark/large fish
	-   Here fishes not only try to escape - but stay with the crowd, not bump into each other, etc.
    
-   Or a predator(s)-prey system - prey - giraffe, predators - pride of lions
	-   More complex predators - how to optimally approach s.t., prey is caught fast
	-   How does prey now evade - or include other behaviours like self defence - kick away the predators.
  

However, it is important to accept that there is a fundamental limitation as to what we can simulate with just the modelling methods mentioned in previous chapters and the ones mentioned below. It is essential and sometimes easier to introduce *evolutionary computing* and *neural networks* - just like how noise algorithms were introduced for procedural texture/smooth-randomness generation instead of manual generation. Even a naive model of evolution in the predator(s) prey phenomena, where the steering choices made by the parent generation is taken and the best choices are passed down - it would lead to more complex behaviour - changing behaviour across generations (here each gen can be placed in the same situation)  
  
  
But in this thesis we shall not pursue that route but, to try to understand what we mean by life-like behaviour exhibited by autonomous characters - i.e. what makes them autonomous in the first place. And to show how much is possible even without introducing *evolution* or *neural* computational models.^2^

## 5.2 Modelling

1.  Individual agents are modelled with the same approach as in previous chapters  
      
    
2.  There are two kinds of multi-agent steering behaviour we will model both into our system and individual:

	- Top-down : where if an agent belongs to a group, it will have to follow the rules/behaviors imposed by the group. Suppose, we are simulating a swarm of fish in a large aquatic tank, then flow following and wall containment might be a general rule for all members

	- Bottom-up : Used when individuals have a preference, say an agent wants to stay away from other entities by 10 px, or move in the same direction as neighbouring agents. Such individualistic behaviours will often cause a chain reaction across all agents of the system (assuming all of them have the same behaviour as well, or a behaviour that will be affected by it). Which may or may not lead to emergent behaviour of the system  
      
    

3.  The system will be capable of keeping track individual properties - lifespan, count, etc:
	a.  To which users must also have access through the system
	b.  and execute actions - removal if dead, capping at a maximum number, etc


## 5.3 Implementation

### 5.3.2 Implementation of system of agents


We will make use of classes to create our agent system. Although ideally just like in the individual case we could create an abstract class that uses the `AutonMover` as its base individual model, and then extend this class further for specific cases, this is harder to do practically.^3^ And classifying which properties can be made part of the abstract class and which cannot is a tedious task. Therefore instead we shall implement just single-behaviour agents into a system, and for each behaviour we shall make a separate system class.  
  
For example, *Seekers* is the class that implements a system of *Seeker* agents. Features that are implemented into the class as per the model mentioned in [5.2](#52-modelling). Each individual is stored in an array (implemented as property this.*seekers*) , with a `maxCapacity` constraint (also a property). This allows one to access individual agents from the system  
```js
class Seekers {
  constructor(maxCapacity = 40){
    this.seekers = [];
    this.maxCapacity = maxCapacity;
  }

  addSeeker(x, y, r){
    this.seekers.push(new Seeker(x, y, r));
  }
```

A `run()` method which will go through every agent and and call the relevant functions for the following:

-   Bottom-up behaviours - implemented on a individual level - called with (possibly) varying parameters - can vary agent-agent - or timeframe - timeframe (depending on situation)
    
-   Top-down behaviours - implemented individually, because
    

	-   If implemented system-wise - it will still have to be looped over for each agent. Therefore requiring multiple loops for each behaviour
    
	-   Therefore to avoid clutter, lower computational costs - behaviour is still implemented individually^4^
    

-   Checks if `agent.lifespan = 0` - i.e. dead and removes it from
    

  
Thus the `AutonMover` class is now updated such that, it has group related behaviours implemented in them, and each child class can now now combine these behaviours and apply a steering Force, according to weights and other parameters imputed into a `applyBehaviours( )` method - inner contents differ individual type to type.  
  
This also implies that the `update()` method no longer deals with applying the steering force for the respective behaviour, and hence can be moved to the `AutonMover` class.

The updated `AutonMover` class
```js
  steer(){
    let steer = p5.Vector.sub(this.desired_vel, this.vel);
    steer.limit(this.maxForce);

    return steer;
  }

  separate(entityArray){
    let count = 0;
    this.desired_vel.set();

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
    return createVector(0, 0);
  }

  cohere(entityArray){
    let count = 0;
    let avgPos = createVector(0, 0);

    for (let otherAgent of entityArray) {
      if (otherAgent !== this && p5.Vector.dist(this.pos, otherAgent.pos) < this.neighbourDistance) {
        avgPos.add(otherAgent.pos);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      this.desired_vel = p5.Vector.sub(sum, this.pos);
      return this.steer();
    }

    return createVector(0, 0);
  }

  align(entityArray){
    let count = 0;
    this.desired_vel.set();

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

    return createVector(0, 0);
  }

  update(chk_edges = false){
    this.updateHistory();

    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (chk_edges) { this.checkEdges(); }
  }
```
 and

```js
  isDead(){
      return (this.lifespan <= 0);
  }
```

And `applyBehaviours()` method in `Seeker` class:

```js
applyBehaviours(seekWeight = 0.5, sepWeight = 0.5, target = createVector(width/2,height/2), arrive = false, entityArray = []){
    let seekForce = p5.Vector.mult(this.seek(target, arrive), seekWeight);
    let separationForce = p5.Vector.mult(this.separate(entityArray), sepWeight);
    
    this.applyForce(seekForce);
    this.applyForce(separationForce);
  }
```
  
-   If maxCapacity is reached, then newly added members are immediately removed
	-   Another possibility is that remove a fairly ‘old’ agent - i.e. has lifespan close to 0 (portrays use of lifespan property - intend to implement)
    

All the above encompassed within `run()` method of the `Seekers` class:

```js
 run(target){
    for (let i = this.seekers.length - 1; i >= 0; i--){
      this.seekers[i].display();

      this.seekers[i].applyBehaviours(/*seekWeight*/ 0.5, /*sepWeight*/ 0.5, 
                                      /*target*/ target, /*arrive*/ false, 
                                      /*entityArray*/ this.seekers);

      this.seekers[i].update(/*chk_edges*/ true);

      if (this.seekers[i].isDead()){
        this.seekers.splice(i, 1);
      }
    }
  }
```
Putting it all together, you get this:

{% include "simulation-grid.html" %}