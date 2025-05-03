---
tags: 'chap2'
script: '/assets/scripts/chap2_04.js'
id: 'sec4'
permalink: false
---
### 2.3.4 A System of Random Walkers

Here is a sneek peek simulation into how systems of same entity types can be made. Similar implementation is made in the 5^th^ chapter and breifly explained there.

{% include "simulation-grid.html" %}

Refer [here](https://github.com/beeezal/Honours-project-codes/blob/ParticleSystem-codes/rWalker_system_basic/sketch.js) for the implementation code

P.S: Drag your mouse across the canvas to spawn new walkers.

## Notes

1. One of many possible [future works](?tab=t.0#heading=h.d5gura22t3ck) to pursue   
2. We could draw a correspondence between the two or have both at play in the same time \- a varying wind force, is both an external Force and random  
3. In programming languages we first simulate a uniform distribution using algorithms that iterate from a given value (taken from some state variable) using operations (addition, multiplication, mod, bit operators) with large numbers. In p5 it is done through a regular LCG (Linear Congruence Generator).  
4. Then all other common distributions are sampled from the uniform distribution, using the *Universality of Uniform distribution* \- which states that the cumulative distribution of any random variable is uniformly distributed.   
5. The implementation differences occur because it was made during the earlier stages of my thesis. We will address and unify most of our motion related code at [4.3.4](?tab=t.0#heading=h.8gepsg7cks0e) when we compare different types of random walkers.