---
tags: 'chap3'
permalink: false
---

## 3.1 Phenomena

1. From above walkers, in case we want to simulate motion phenomena such that it is smooth - smooth being in terms of visual appearance - movement is not jerky / jagged - curvy / continuous.   
2. We could constrain our normal walkers parameters further to do the trick - but end of the day   
   - It is still purely random numbers so one can still get a jerky turn \- if first random value on one side and the next on the other   
   - scaling down to small intervals may not be feasible - and don’t really need normal distribution at that point - use uniform only  
3. It might be a better idea to create a algorithm that produces random values that could be somewhat close to each other \- when the input is also somewhat close to each other - by design choice - exactly what Perlin noise (henceforth referred to as PNoise) does [Perlin 02]

5. This has much more uses beyond smooth motion - any kind of animation requiring smoothness - a key part of *natural looking* phenomena  
   -  Terrain - in a forest - trees not of same height - but overall neighboring trees will not be too different in height (assuming they are of similar species)  
   - Textures - on stones - marbles, tiles, granite, etc. all have varying bright and dark areas - but changes gradually - no stone is half black and half white

## 3.2 Modelling 

* PNoise (Perlin Noise) definition  
  1. PNoise can be thought of as a function/algorithm that takes in N-dimensional input (co-ordinate) and returns a random value b/w $-1$ and $1$  
  2. PNoise generates a sequence of pseudo-random numbers that appear to be smoothly varying  
  3. i.e., given two inputs close to each other the output will also be close to each other  
  4. Different from noise / white noise - there samples are completely uncorrelated   
  5. It doesn’t add noisy-ness to existing data or smoothly interpolate between pre-existing noisy/random input.

* Such algs are called procedural noise functions \- this is what we refer to when we say noise \- other examples are Simplex noise, Value noise [ LSRD*10 ]
    
* Perlin noise is a type of lattice gradient noise   
  1. Define some random objects (mostly values or vectors) over a subset of the given space  
  2. For an input point identify the neighbouring points from subset (lattice)  
  3. Interpolate a value from the random objects with some weighted function

* Perlin noise in 2D specifically uses:  
  1. Integer lattice grid and the random objects are gradient vectors - 4 unique vectors^1^ - randomly arranged throughout lattice  
  2. Then first we calculate the values to interpolated as:  
     1. dot ( vector at lattice point $i$, difference vector from lattice point $i$ )  
     2. Interpolate between these values - in two stages - first along $x$-axis, then $y$-axis, where weight of each value is the distance of the lattice point from the given point - distance here just being the $x$-component in first stage and $y$ - component in second 

## 3.3 Implementation

### 3.3.1 Implementation of the perlin noise algorithm

Random arrangement of the vectors:

* A predefined array of permuted numbers (0-255) $P$ and an array of 4 vectors - $G$ - where each vector is the vector pointing from origin to one corner of the unit square.^2 ^  
* Now for each lattice point $(x,y) \in Z^2$ - ( Actually just $\{0...255\}^2$ ), we assign the vector $V(x,y)$ = $G’[ x + P[y]]$ - that is the $(x + P[y])^(th)$ element of $G’$, where $G’$ is just the array $G$ repeated till it is the size of $P$. But note that adding $x + P[y]$ may be greater than $255$, but is less than $512$ - therefore we’ll just double our $G’$ and $P$ arrays- repeating their elements. 

The choice of the particular $P$ array - is arbitrary - made by Perlin, after some randomisation and a visual output that was enough for his purposes. Though modern implementations come with a seeding option to generate a different permutation list.   
But an important characteristic is that for a given seed, every lattice point will also have the same vector assigned to it  

Noise value at any $(x,y) \in R^2$ implemented in **jS** as follows:

```js
module.perlin2 = function(x, y) {
  // Find unit grid cell containing point
  let X = Math.floor(x), Y = Math.floor(y);
  // Get relative xy coordinates of point within that cell
  x = x - X; y = y - Y;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255; Y = Y & 255;


  // Calculate noise contributions from each of the four corners
  let n00 = gradP[X+perm[Y]].dot2(x, y);
  let n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
  let n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
  let n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);


  // Compute the fade curve value for x
  let u = fade(x);


  // Interpolate the four results
  return lerp(
      lerp(n00, n10, u),
      lerp(n01, n11, u),
      fade(y));
  };
```

This code can be viewed at the GitHub repo for this project [here](https://github.com/beeezal/Honours-project-codes/blob/release/thesis-examples/NoiseExamples/noise.js). This contains the defintion of all the other components - such as linear interpolation, ease function, $P$, $G’$.^3^ 

* Explaining some implementation choices:  
  1. The use of $256$ as our choice of array size, allows us to not use modular arithmetic (which is costly in terms of computation), but we can just use bit operators, because $255 = 1111111_2 $  
  2. Why are our vectors gradient vectors \- because the value of dot product gives information about how aligned we are to the vector at that point \- more alignment greater is the value \- i.e. the vectors point to the direction in which the values increase the most \- definition of gradient vectors of a function in calculus.  
  3. Explaining the fade/ease function \- avoids sharp artefacts at the lattice points \- i.e. reaches 0 linearly \- looks unappealing and obvious that it is indeed a lattice point.   
  4. Ease function basically gives lower weight to the value when we are close to the particular lattice point and more when we are towards the center. 

* Note, what we are doing is defining noise within the $256^2$ lattice \- and extending that to rest of the cartesian plane \- this works because the interval is large enough before repeating \- this is also why in actual examples we will not use the coordinate point $(x,y)$ exactly \- but either scale it down to a smaller number or run it through a function \- hence on larger surfaces still not see the repeating pattern easily

### 3.3.2 Implementation of the perlin noise walker

Rand_func:   
`noise(val)` - produces 1D perlin Noise value4

Applied parameters:

* Location - directly through x, y coordinates of position  

  range:  $x \in [0$, width of screen $]$, $y \in [0$, height of screen $]$, 

* Direction, directly through $x, y$ coordinates of velocity,  

  range \= $(-3,3) $ 
* Velocity (both magnitude and direction)  

  range: 
  - $mag \in (0, $ diameter $/2)$,   
  - direction $\in (-1,1)$
```js
/* Code for a 2D RW that is manupilated according to perlin noise.
Walk is performed by picking a noise value separately for the x-coord and y-coord
Hereafter noise value will be referred as n-value*/

class Walker {
  /* Setting class fields - offests for each co-ordinate (starting point in time for the noise function)
  x and y offests are always increased and z offest only when step() affecting_parameter is 'step'*/
  xoff = 0;
  yoff = 1000;      ////Note that the difference is arbitrary, but it is important,
  zoff = 2000;      //in order to avoid co-orrelation between each direction (in a given time t)
  constructor(x,y,r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }

  display() {
    //Displays the walker at the current location with a circle of radius r
    stroke(0);
    fill(100);
    circle(this.x, this.y,this.r);
  }

  step(affecting_params='direction') {
    //Switch statement to determine the which parameter is being affected. Default: direction
    //All of them are affected by Perlin noise
    switch(affecting_params){
      // Changing the direction in which the walker is moving
      case 'direction':
        this.x += map(noise(this.xoff),0,1,-1,1)*3;     //map() scales n-value to (-1,1) from (0,1) - Enabling RW to move in all directions
        this.y += map(noise(this.yoff),0,1,-1,1)*3;     //3 is the maginitude of the step. An arbitrary standard accross all RW methods
        break;
      // Directly changing the location of the walker
      case 'location':
        this.x = noise(this.xoff)*width;                //noise(t)*k - scales n-value to (0,k) from (0,1)
        this.y = noise(this.yoff)*height;               //Therefore here x-values are (0,width) and y-values are (0,height)
        break;
      
      // Changing both step size and direction
      case 'step':
        let vel_mag = noise(this.zoff)*(this.r/2);
        this.x += map(noise(this.xoff),0,1,-1,1)*vel_mag;
        this.y += map(noise(this.yoff),0,1,-1,1)*vel_mag;
        this.zoff += 0.01;
        break;
    }

  this.xoff += 0.01;
  this.yoff += 0.01;
}

let w;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  w = new Walker(width/2, height/2, 20);
}

function draw() {
  // Be aware of which function you call first according to the step type you chose
  w.display();                             
  w.step('direction');
} 
```
A simulation of a similar implementation of the Perlin Noise walker is added to the 4^th^ chapter, in section [4.3.4]()

## Notes:

1. This is in the improved Perlin noise \- made in 2002, the original noise implementation (introduced 1984\) has a set of 256 randomly generated vectors \- and there are other changes that were made to the implementation. Perlin further made even more improvements to the implementation, by changing the definition grid structure and introduced a new algorithm \- Simplex noise.   
   Because the idea of the algorithm is more important than any specific implementation for the purposes of this thesis, these differences are omitted from discussion

2. An advantage of this choice is \- neighbouring grids will not end up being too similar \- which would cause a large area of very similar values.  
3. Note that this is a native JS implementation hence not written using **p5** functions. And the implemented function for Perlin noise in **p5.js** called `perlin()` is a different noise algorithm (value noise) which is what we use in [3.3.2](#3.3.2-implementation-of-the-perlin-noise-walker) for our Perlin Walker. But this doesn’t the output much, as implementations of both noises in 1D are similar.  
4. 1D PNoise works analogous to how 2D PNoise was explained above \- in fact **p5.js** implementation and actual implementation of 1D PNoise works the same way.