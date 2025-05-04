---
tags: 'chap4'
script: '/assets/scripts/chap4_02.js'
id: 'sec2'
permalink: false
---

#### Evading behaviour:

Selected action: Running away from pursuer/target

Steering behaviour: Desired velocity is pointing away from the target at maxSpeed - negative of  desired in seeker.

Implementation:
```js
  evade(target){ 
    this.desired_vel = p5.Vector.sub(this.pos, target);
    let distance = this.desired_vel.mag();

    this.desired_vel.setMag(this.maxSpeed);
    return this.steer();
  }
```

**NOTE**: The above snippet looks different, because it is from newer implementations of all agents, where steer **doesn't apply the force**, but just **returns whatever force** should be applied. This will be further explained in chapter 5.

Similar to the seeker, we implement a sense of ‘depth perception’ to the evader, by calculating the distance from the target, and slowing down if far enough - perceived safe - from the target, and speed up, faster than usual if close enough - perceived unsafe - from the target. Including this in our implementation, we have:

```js
  evade(target, safeAware = false){ 
    ...
    if (safeAware){
      if (distance < 150) {
        let desiredMag = map(distance, 150, 0, this.maxSpeed, this.maxSpeed*2);
        this.desired_vel.setMag(desiredMag);

        return this.steer();
    }

      if (distance > 500) {
        let desiredMag = map(distance, 600, 500, this.maxSpeed * 0.2, this.maxSpeed, true);
        this.desired_vel.setMag(desiredMag);   
        
        return this.steer();
      }
    }
    ...
  }
```

Therefore we have our simulation

{% include "simulation-grid.html" %}