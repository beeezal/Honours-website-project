---
tags: 'chap5'
script: '/assets/scripts/chap5_02.js'
id: 'sec2'
permalink: false
---

Finally, here is a implementation of flocking behaviour, whose design is taken from *Autonomous Agents* chapter by \[Schiffman 24\], but the implementation is based on the models that we see in this chapter,

{% include "simulation-grid.html" %}

## Notes:
1.  Individualistic also means selfish behaviours. If one observes closely none of the models of behaviour and hence implementation looks at behaviour an agent makes for the sake of another agent - separation is designed with the intention of ‘how can I avoid colliding with others to save myself’ over ‘how can I move away so that others can move without trouble’.  

    This, in the world of code, makes no difference, as optimal states reach from either side. But - are there possible complications / simplifications that could arise when we try and code altruistic agents - how can we model such behaviour - as sometimes that is also found in nature - leader following, etc.

2.  Much work has been done in different directions - each interesting in their own regard. One, trying to classify and formalise the notion of autonomous agents - when it is all just code and algorithms [Franklin 97] and the other is also seeing how far can one can go without implementing reasoning and intelligence directly into their model [Brooks 91] - this could be one of many FUTURE WORK.
    
3.  The hardness comes from identifying what child type is each individual agent - if the system is heterogeneous (or even when homogeneous) and then apply that type specific behaviours to it. This could again be implemented with the help of callback functions and type definitions / identification methods. But types are not natively built into JS - TypeScript is an extended programming language that does exactly that. Therefore, such implementations are beyond the scope of this thesis.
    
4.  One drawback of this approach is that we cannot have different parameters for the same behaviour for different agents. At least, no simple, intuitive approach exists in **p5**.js or **JS**


