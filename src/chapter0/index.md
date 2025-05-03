# Chapter 0

# Getting Started

Understanding *life-like* behaviour is a fascinating pursuit of the sciences that tries to characterise the qualities of physical entities which helps us to distinguish between life and *non-life*. This pursuit has major implications in various fields of science. For example, when we model *life* through some known characteristics, it allows us to observe patterns that can guide progress in discovering more characteristics of the biology of *life*; it also helps us confirm observations/behaviours we see as a natural consequence of the model. Which is not only useful to understand ourselves better, but could also help us better search for life outside our planet.^1^

## Note about the primary resource:

All the phenomena that are simulated in this project are heavily influenced and inspired by the *Nature of Code* [Schiffman 24] online book. Therefore, both the progression of concepts in chapters, and ideas of the simulation possess resemblance to Schiffman’s book.

But this project also wishes to depart and go further than the book in a few aspects.

1. The main goal of Schiffman is to teach (creative) coding techniques and algorithms and how to develop models in a basic object-oriented manner, through examples in natural phenomena. The main goal of this project is to understand motion phenomena better, and therefore, I focus on building up from every previous step to larger and larger models till the end of the project.
2. This causes the implementation of ideas/algorithms to look different. Although Schiffman also builds on ideas previously visited, each topic/technique is itself isolated where there are references made to other parts, but the code is rewritten (sometimes changed to better suit the context). While code in this project is written with the intention of being modular/reusable, and if a piece of code needs to be rewritten, we will go back to the initial creation of it, and make it more general.
3. Schiffman also ignores some coding conventions (for eg: variable naming), as the focus is to inculcate algorithmic thinking. But, in this project such conventions are more strictly followed because of the following reasons:
   a) I hope that this serves also as a resource for one to go from a beginner to an intermediate programmer, as I myself did. Therefore, attempting to inculcate good coding habits.
   b) To also make it easier to build on the work that has already been done in this project and make/suggest improvements to it. It is also more helpful when we are creating more abstracted code from observed patterns. Which is focused on my project to a higher degree and therefore help newer programmers learn how to do it as well as compared to Schiffman’s book.
   c) Finally, in \[Schiffman 24\], we mostly go from phenomena to code, but after the implementation, there is not much importance in going back and understanding the output simulation and. This is because the code written in [Schiffman 24] is the polished version and most improvements made to code are constructed over explored. Whereas in this project (especially in later stages) there is slightly more emphasis on this aspect. Where code improvements also sometimes come through exploration, this is also especially highlighted in the publicly available GitHub repository ([see here](https://github.com/beeezal/Honours-project-codes) for this project - where one can view the commits and see the growth of code over time.

Therefore, in this project we are approaching the question of *“What makes life, life?”* through the lens of *motion* phenomena of physical entities and with the eyes of computer simulation. We take interest in motion phenomena because *natural* phenomena cover a broad area of topics, therefore focusing on a particular section of it lets us dive deeper into more elaborate models. Hence, providing further insight into the various characteristics (or components) of *natural* phenomena. *Motion* is also chosen because it integrates with animated simulations (i.e. the visualisation aspect) and Object Oriented Programming easily, which is the core engine of the simulations in this project, especially the p5.js library that we will be using.

## Flow of content:

We will try to understand what makes motion phenomena *natural-looking / life-like by* looking at three specific components of such phenomena - physics of motion, randomness, and autonomy. One can think of this as creating an environment with a set of governing rules (the physics), and allowing the entities in it to act (autonomy), but also allow for uncertainty within the environment and the actions of the entities (randomness).

In the 1^st^ chapter, we explore how to animate and model our required physics for *motion* simulation with the help of vectors and Euler integration to simulate the laws of physics. The chapter also discusses how such models often look at the limitations of the modelling environment (here computers) but also accounts for limitations of the viewer which allows us to reduce the complexity of the model.

In the 2^nd^ and 3^rd^, we study how randomness is generated in computers and how to simulate entities that move randomly but also with other desired characteristics. For example, we try to achieve ‘smooth’ walkers by both restricting parameters of the distributions and applying the generated random numbers to different quantities. But, also introduce an algorithm (Perlin Noise) specifically intended to achieve this quality. Lastly, the chapters also elaborate on how one can use these simulations in order to better understand the distribution and algorithms which produced them.

Then we define what *autonomy* is and provide a hierarchical classification of autonomous agents in the 4^th^ chapter. A key coding technique called *Inheritance* is explored, to showcase the relationship between how both nature and code evolve. We also simulate a *wandering* autonomous agent and compare it with other randomly moving entities created previously, and make observations trying to distinguish one from another - autonomous and not.

Finally, in 5^th^ chapter we devise a model for multi-agent systems based on the particle system introduced in 2^nd^ chapter and the implementations given by [Reynolds 99], [Schiffman 24]. Using the model and all the components of natural motion that have been explored until now, we create a flock of entities each acting based on their individual perception and we observe the emergent behaviours of the entire system.

## 0.1 Prerequisites

- Beginner level fluency in coding - in any programming language
- Know about variables, functions, basic types (numbers, strings, array) and related functions, conditional and loop statements, value assignment
- Their general respective syntax in coding
- Can understand the most common programming terminologies - like ‘instantiate’, ‘class’, ‘arguments’, etc.
- Basic mathematical background in vector algebra, probability, statistics
- Basic knowledge of topics of motion in physics - Newton’s laws, rigid body mechanics - collision, friction and gravity

## 0.2 p5 Basics

### 0.2.1 p5.js terminology

**Sketch**

- Refers to the entire bundle of files that runs a .js file containing p5 objects - index.html, style.css, p5.js / p5.min.js (the library file) and finally the main source-code file
- But also can refer to just the source-code file, hence usually named sketch.js

**Canvas**

- The drawing board / screen / environment in which all animation that is coded in my sketch.js file is drawn to.
- To create our virtual environment, i.e., the p5 Canvas - we call the createCanvas(width, height) in the setup() method.

Look at [Appendix A]() to learn how to run the code written in this project.

### 0.2.2 Common functions

- Part of all **p5** sketches:
  - `setup()`: is used to define the initial environment properties such as screen size and background color
  and creating any objects required in the programme. When p5.js library is used in our project, it calls the `setup()` function once in the beginning (automatically). And looks for the defintion of our `p5Canvas` element and the other properties as mentioned above.
  - `draw()` : is called repeatedly in a infinte loop. It is used to animate the objects on the canvas (explained in the next chapter)

- Therefore every **p5**-sketch at its core, has these two functions. With one or two more global functions - usually for handling **HTML** events like, `mousePressed`, `deviceMoved`, etc.

- We also have built-in ariables/constants with attached values/meaning - variables like `width`, `height`, `frameRate`, `frameCount`, etc., all containing their obvious meaining. The dimensional variables refer to the   _Canvas_. 
For convenience we also have some mathematical constants such as `PI`, and its multiples like `QUARTER-PI` and `TWO-PI` (also called `TAU`)


- usual animation object attributes:
  1. `fill`: defines the colour in which shapes are filled
  2. `stroke`: defines the colour of the border of shapes after its' call
  3. `strokeWeight`: defines the border thickness
  4. `push`: will save the current transformations (changes in point of references, rotation of the plane to color, size, etc.). Used in complement with
  5. `pop`: which

## 0.3 Assumptions

- All values given to variables are arbitrary - post little experimentation with other values - unless mentioned otherwise
- General structure of a .js file:
  1. Defining required functions, class(es)
  2. Declaring global variables
  3. `setup()`
    * Set initial properties (explain some important ones)
    * Instantiate our class object for the given example
    * Instantiate earlier declared codes
  4. `draw()`
    * Draw the required components in a single frame
    * In motion phenomena this would usually include a `display() `function and the we would also `update()` the required variables to be drawn in the next frame
- The size of the canvas is dependent on the requirement and kind of phenomenon we are simulating - hence no standard size. But as a standalone sketch - as written in main source files - width and height will be set as `windowWidth` and `windowHeight` - to fit to the dimensions of the entire browser screen.
- All functions and objects that are not explained within the embedded code blocks or in a section, are trivial and its use can be derived from its name and parameters. If further explanation is required please look at the p5.js reference (link in bibliography).