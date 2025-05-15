---
tags: [main, conclusion, simulation]
title: Conclusion
layout: 'base'
order: 7
prevPage: '/chapter5/'
nextPage: '/bibliography/'
---
# Future Work

### Immediate work 

These are mini-projects that I can immediately get to the end of, based of what has already been studied and done in my project:

1. A larger multi-agent and multi-type simulation. For example, an aquarium ecosystem: where there are sharks, small fishes, obstacles (like corals), food, currents. All these can be developed with the ideas presented in this project and \[ Schiffman 24 \] likewise, along with the other topics like Cellular Automata, Physics Libraries, etc., as mentioned in his book.  

2. A library of p5.js movers made from all the code in this project. The documentation of the library can be written with JSDoc and compiled and published online \- just like this project website. Such a library can act as a learning companion for programming, simulation and related courses; can be used to also create more complex and larger simulations (large in terms of types of entities) with more ease.

### Medium/Long-term pathways

These are pursuits that will take more time to realise completely, because of the extra knowledge required \- either deeper understanding of already studied topics or topics from other subjects.

#### Autonomous Agents in a Microscopic World

All our simulations in this project have been for *macroscopic* motion phenomena. One future project is possibly looking at *microscopic* agent-based simulations of *microbial environments*. The major differences to those seen in this project would be, the movement \- running vs crawling \[Reynolds 99\], where in microbial environments we have that the speed of the agents is slower than their rate of turning. And, the lack of machine learning is no longer a hindrance to our simulations, but a feature since microbes do not possess reasoned intelligence.   
Agent-based modelling in this setting has been researched to some extent, producing some frameworks and softwares [ GTAT* 12 ]. They have a wide range of applications from characterising interactions within a ecosystem to guiding design of gene circuits in synthetic biology [ NCT 22 ]

#### Smart / Learning Autonomous Agents

As mentioned in [chapter 5](../chapter5#51-phenomena), in order to overcome the bridge of simulating agents that seem to exhibit high intelligence level / reasoning, we can introduce neural networks and machine learning algorithms into the picture. Keeping the context of the paper, one interesting question that we could try and answer is:  
Can pseudo-randomness evolve as a strategy when we use generational neuro-evolution as covered in \[Schiffman 24\]. That is, suppose we are trying to simulate the example of the gazelle as given [here](../chapter4/#41-phenomena), then will the gazelle learn to make ‘random’ turns at ‘random’ intervals of time (so evolves to become a *Wanderer*) 

#### What is Autonomy in an Algorithmic world?

There was a clear unease for me when ambiguity arose while dealing with classification of entities as autonomous agents or not. So, going a step further in the direction of section 4.3.4 can we also quantitatively classify autonomy. Even if not in the general case, can we at least do so in *motion* phenomena. There have been attempts to differentiate between a program and an agent \[Franklin 97\] and there are also arguments that agents don’t have to be modelled with reasoning to appear *autonomous* \[Brooks 91\]. Both of these approach the problem from a modelling point of view, while I have not found any that attempts to differentiate them based on observation (therefore entities that may not necessarily be modelled as *autonomous* could practically be one). 

There are multiple parameters we could try and observe. For example turn speed and turn rate \- i.e., how fast can the agent turn and how often does it turn. We could try and study the distributions and expected values of these variables.

#### More noise walkers

Perlin noise is a fairly old algorithm introduced in 1985, and although improvements were made to it later \[Perlin 02\], it is still one of the earlier procedural noise functions. Much more newer algorithms have been developed more recently of which perform than Perlin noise on various aspects and take lesser space \[LSRD\*10\] . But most of the evaluation parameters stem from computer graphics. So, there could be merit in trying to apply these algorithms to our motion simulations like in [chapter 3](../chapter3/#332-implementation-of-the-perlin-noise-walker) and compare them visually (do they look different and ‘better’ in terms of appearing *natural* ), qualitatively (how good these movers could be at evading or foraging \[ Reynolds 99 \]) and quantitatively as addressed in the previous section.
# Conclusion

In exploring all the topics covered in this project, I have learned greatly to write, think and speak in the language of code. It has helped me see how thinking with an object-oriented approach can help me break down a phenomenon/problem into smaller components; and understand how our perspective affects our modelling choices which in turn changes how the implementation is made. Therefore I hope the reader/viewer is able to see these learnings through the project, and that they too could learn one or two similar things.

Further, through this project, one should be able to see that the OOP approach built around modularity/reusability, where you start off with simple (and almost boring) functionality, and then iteratively build up on it, to make a complex phenomenon emerge is similar to how natural entities also evolve. Take what its ancestral species has already learnt how to do, and build upon it; evolving and adapting to more nuanced situations and discarding what is useless.  

One should also note that though complexity increases as we move along the evolutionary nature of code, things still don’t go wrong because, structural organisation of our code also becomes better. The same is true in *nature* as well, in order to survive and evolve - adding more functionality to your system, one would also need an efficient way of storing it. Otherwise the entity will either forget/not use everything it has learned, or fail to adapt and die out.

Finally, as all the new coding concepts introduced in this project are explained in detail, the project can also serve as a base material for moving from a beginner coder to an intermediate one, while delving deep into one of the vast number of topics mentioned in my future works. So one can explore further in creative coding or use the classes made in each chapter as a library for further exploration. One can also research much more into understanding and modelling autonomous agents, or can look further into newer animation techniques like noise and how they make use of smart algorithms and limitations of the human brain. Therefore, the project is intended to serve as a starting point for endless possibilities of research, experimentation and exploration.