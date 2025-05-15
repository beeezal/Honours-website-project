---
tags: 'chap4'
script: '/assets/scripts/chap4_04.js'
id: 'sec4'
permalink: false
---

### 4.3.4 Comparing implementations of random motion behaviours

The main reason we have implemented Wandering behaviour, instead of the other autonomous behaviours mentioned in [Reynolds 99] is the theme of randomness that we have explored until now. Then the question arises, that when all things considered most of the movers until this chapter possesses random movement, what makes Wanderer special?

Therefore as an attempt to answer this question, we will compare Normal walkers, Perlin walkers and Wanderers (in order of their visually ‘smooth’ movement). But in order to compare them, we need them to have comparable parameters and similar implementations. But as we’ve seen, the implementations of our random walkers vary according to their own context.

Therefore first, we generalise the structure of our walkers and rewrite the code containing these walkers according to the general mover model from 1.3.3 where, the update function is a modified version of the pseudo-code in 2.3.1 where

```
update(p1, p2, … , pn){
  updateVelocity(applied quantity, p1, p2, … , pn)
  new pos = 𝑓( velocity [, old pos] )  // i.e., new pos = old pos + velocity

  checkEdges()
}
```

Where, we calculate velocity in `updateVelocity()` every frame, from the applied quantity which itself is either internally (which may take environmental factors into considerations). Then 𝑓 calculates the new position using Euler integration, i.e., and if we are outside our canvas, `checkEdges`, will position us back into the canvas (at the opposite end of where we went out from). Therefore by ensuring all three types of movers follow this structure, allows us to do two things:

1. Reduce the problem from looking at each simulation separately, to just looking at the affecting parameters (p1, p2, etc,) and knowing that all other things are the same. We’ll have that the  the size of the movers, the sketch to be the same and
  - $r = 10$
  - pos = (`width`$/2$, `height`$/2$)     (initial value: center of the screen)
  - vel = `p5.Vector.random2D()`      (initial value)
  - maxSpeed = $3$

2. Guides us towards creating a more abstracted mover class, from which all the different types can be made using Inheritance as seen earlier in this chapter. (Note, that though this has not been made in this project)

Now, though we can make direct visual inferences about the change in a mover’s behaviour (i.e., path) when a parameter is changed, it would be better to have an exact visual representation of the path so that we remove the bias that might occur in observations, and also us also observe minor differences. But, we cannot go back to not calling `background()` every frame, because it causes clutter in our simulation, especially when it runs for long periods of time. Therefore we create a new property `posHistory` array in our `AutonMover` class , in which we store $x$ positions visited up till current frame, and a new function `updateHistory()`, which adds the current position every frame, and removes if we are above the limit $x$. This allows us to observe the local behaviour of our mover, if 𝑥 is made larger we can also observe more global behaviour. Therefore the structure finally will look like this

```
class GenericMover(){
  display(){
    if (this.showHistory) {
      for (let i = 0; i < this.posHistory.length-1; i++) {
        let prevPos = this.posHistory[i];
        let currPos = this.posHistory[i + 1];
        
        // Check if the Mover has jumped edges, and continue the loop and don't draw the line
        let posChange = p5.Vector.dist(prevPos, currPos);
        if (posChange >= windowWidth || posChange >= windowHeight) {
            continue;
        }
        line(prevPos.x, prevPos.y, currPos.x, currPos.y);
      }
    //Usual things to draw in display
  }

  updatePosHistory(){
    // Limiting the maximum number of elements so that the array doesn't grow indefinitely
    // Array.shift() removes the 1st element, which is the oldest position visited by the walker
    this.posHistory.push(this.pos.copy());
    if (this.posHistory.length > maxArrayLength) {      // The max limit can be modified - could be added as a parameter
        this.posHistory.shift();
    }
  }

  update(){
    ...
    this.updatePosHistory()
    ...
  }
}
```

And we also add the boolean property showHistory to toggle drawing the path - which is set true for all our movers in this section. Therefore, now the only difference between each of these movers is the implementation of `updateVelocity()` and the parameters that affect it.

(Note though, there are other extra functionality that has been built into each of these movers made for their context, that has been left unchanged from previous implementations - but these do not affect the movement in any way)

So, below are the visual observations of each of these movers. This is meant to be read with their particular implementations (so please [check this branch of the GitHub repo](https://github.com/beeezal/Honours-project-codes/tree/feat/trial-path-movers)), based on set parameters (the observations are made in comparison to each other, where the Wanderer is considered as the baseline, and few observations are also made w.r.t, their own parameters)

**NormalWalker:**

updateVelocity = `setAngle()`
And update = `step()` where,

```js
  setAngle(sigma = PI/8, mu = this.vel.heading(), changeRate = 1, changeColor = false){ 
    // Function to set the direction angle of the walker's velocity
    // changeRate - rate at which we change the angle in terms of frames
    // changeColor - Whether walker's color changes when the direction changes significantly (>2 SDs)

    if (frameCount % changeRate === 0) {
      // randomGaussian() returns a random sample from a N(0,1) 
      // Therefore by performing scaling and translation of the distribution we have 
      // the directionAngle distributed according to N(current direction,π/8) or N(μ,σ)
      
      this.directionAngle = randomGaussian() * sigma + mu;     //σ and μ were picked experimentally
      // this.drectionAngle = randomGaussian(mu, sigma);		
      
      // Changing color if change in direction is more than 2 SDs
      if ((changeColor) && abs(this.directionAngle - mu) >= 2*sigma) {
      this.col = color(random(255), random(255), random(255));     // color is set by choosing random RGB values
      }
    }
  }
```

and `step()` follows the general pattern implemented, with

```js
  step(vel_mag=3,chk_edges=false) {
    this.updatePosHistory(1000);

    this.setAngle(PI/8, this.vel.heading(), 1, false);
    this.vel.setHeading(this.directionAngle);        
    // v.setHeading(direction) is same as v = v.mag() * (cos(directionAngle), sin(directionAngle))                                       
    this.vel.setMag(vel_mag);
    this.pos.add(this.vel);

    if (chk_edges){this.checkEdges();}
  }
```

(The simulation show in chapter 2 is sufficient for the following observations. But an implementation following the above model can be found [here](https://github.com/beeezal/Honours-project-codes/blob/feat/trial-path-movers/Normal_Random_walker/sketch.js) )

**Observations**

- Visually similar to an ant - movement is a bit jagged, almost as if to visit and get a sense of all the neighbouring areas of current position.

- Jagged motion is due to the fact that though the mean is the current direction, since there is no correlation between the previous angle and current angle, polarising direction could be picked in consecutive frames.

- There are also immediate revisits in the form of small loops, which can be attributed to the independent ‘randomness’ of the angle value. So suppose a large value towards the left is picked once, and independently again a left-value is picked (and so on - but not necessarily in succession but in close frames) then as there are 60 frames in a second, the loop occurs.

- Both the jerky and small loops can be largely eliminated if the SD is set to a very small fraction of pi. This also causes loops to almost never occur, which may be undesirable if we want unpredictability and/or some revisiting to occur locally in time.

**PerlinWalker**

updateVelocity = `static noisyVelocity()`

Extended functionality to add noise to even step size, directly into `step()` with parameters:
- `noisyStepSize` : toggle for adding noise to step size, default = _true_
- `relativeMaxStepSize` : decides the maximum of the range of noise added, default $=0.75$

**NOTE**: setting the slider value to $0$ in the below simulation, sets `noisyStepSize` to _false_

{% include "simulation-grid.html" %}

**Observations:**

- Visually similar to the wanderer, but behaves more unpredictably, almost like it is juking and avoiding something

- That is, a lot less immediate revisits and jerkiness compared to the normal walker. Loops occur, but the interval between and its size vary a lot. The motion is always smooth, even when the looping size is small.

- All of the above above observations can be attributed to two qualities of the implementation:

- The highly correlated output given by PNoise algorithm

- The magnitude scaling to a constant, even though the real output varies anywhere within the unit square.

- So when PNoise returns smaller values of both x and y coordinate, the change gets magnified by the magnitude scaling and therefore extremely small loops occur. But, when larger values are returned in both coordinates, then the change gets diminished by the scaling.

- This added to the fact that we make sure the x and y coordinates are independent of each other - by taking a large offset in their input values, causes the highly unpredictable yet smooth motion.

- If less smoothness is desired, one can simply cause the change in input value to increase more each frame, hence reducing the correlation between each frame’s position


**Wanderer**

updateVelocity = `calculateWanderTarget()` + `steer()`

Implementation is the same as given in the previous subsection.

Observations:

- Visually similar to a police vehicle patrolling a particular open area. Revisiting occurs in loops that are much closer to circles than ellipses as seen in the other movers, and the loops are never small, therefore each revisit feels more intentional than happenstance, because of its random nature. Loops also occur the most often, with other curved/straight paths being rare.

- The movement therefore presents itself as extremely smooth and circular - like a double compass where the pivot is changed at random intervals of time

- First it's important to note that these observations align with the design choices and model intentions6 of a long-term order (in terms of looping behaviour) and sustained turning [Reynolds 99]. Both the intended goal and the observations can be related with:

- Constraining the seek target onto a circle and changing its position randomly on it. This causes the direction to stay constant much longer, as the position of the target is dependent on its previous position and though there is no correlation in the direction the target moves, since half of the circle causes the mover to move in a single direction, sustained turns are created

- The limitation of the steering force inherited from the Seeker plays the main role in the lack of smaller loops, as the Wanderer is never moving to its desired destination as ‘fast as possible’, therefore making the sustained turning more pronounced.

- If one desires to have a Wanderer that is less circular/revisiting, then increasing the amount of change of the target, or the predictionInterval is required (reducing correlation similar to PerlinWalker). In order to reduce the long-term order that we see, we would have to introduce more randomness (one that has less correlation) and I found that randomizing the radius works the best, as seen in the previous subsection.

**Concluding thoughts of this section**:

From the above observations, it is clear that if one had access only to the simulation output and not the implementation or design of model, it would be hard to call only one of them autonomous, while the others are not. It would seem to the viewer as if all are autonomous or all of them are not, based on their perspective.

For one might think that it is absurd to call ‘roam around’ or ‘walk randomly’ a goal at all in the first place. One could argue that it is indeed a goal when you introduce ‘sustained turning’ for the Wanderer. But one could also equally argue that the introduction of ‘be unpredictable’ or ‘change direction to avoid being caught by a predator’ makes it a goal for PerlinWalker. Such ambiguity could be resolved (or attempted to) by then looking at the model itself and intentions behind each choice.

Then, one could say that there was no intention in the implementation of PerlinWalker beyond providing a smooth random walker, while the clear intentions of design for the Wanderer (which is definitely achieved) has directly affected the implementation - where we use desired velocity and steering forces in order to drive the motion of the mover.

But, one could draw equivalences between the algorithm for PerlinWalker and that of Wanderer, or even make them similar without introducing new design intentions, and there is still the problem of the uninformed viewer. Therefore, there must be more work done in regards to the definition of an autonomous agent, to clearly distinguish between each case mentioned here.

Therefore I end this section by claiming that classification of wanderer is an edge case, and including that may have us include perlin noise as _autonomous_ well - is an important observation. Yes, as expected one should be able to go back from visuals to intended outcomes and check what is going on. All arbitrary variable choices in this proejct are in essence an outcome of this effect

## Notes:

1. This also implicitly implies that we only give limited information about the environment to the agent. This is an intentional design choice because, providing too much information is redundant, and is also unrealistic in nature - no being would have unlimited perception of its surroundings - then its choices would be according to a global optimum, rather than a localised behaviour.

2. This does impose one limitation of OOP in JS, which is to define an agent with 2 behaviours one cannot simply give it the properties of two classes implementing them separately. \n
  We would simply have to implement a new class that contains both the properties - which is extra code doing the same thing - violating the DRY principle of programming \n
  To combat this we can define the individual behaviours from the class implementing both - though this reduces code length - it is unintuitive in approach.

3. We could technically contain all of autonomous agent implementation just inside AutonMover - use callback functions to implement specific behaviours - i.e., create functions - for particular behaviours - and pass them into AutonMover. But there is a line to be drawn between understandable and compact, which is beyond the scope of this thesis.

4. We could also increase speed as we initially get closer - visually stimulating an agent that gets ‘excited’ as it observes the closeness of its target

6. Wanderer was implemented first - observations made - then compared the design choices of [Reynolds 99] with observations - asserting the action selection / ‘goal’ set there was achieved. This is further explained in

7. We can get the target although it's private, because we defined a getter method for it within the Wanderer class.

8. The implementation of the wanderer ideally should be self contained within the class, but in the given code it is incomplete without the actual sketch. Because  the randomisation of radius of the target circle is implemented globally, although it can very much be implemented within the class