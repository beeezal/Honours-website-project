// A simple p5js script 'simple_script.js'
let bouncingBallScript = function (p) {
	class Mover {
		constructor(x, y, m) {
			this.pos = p.createVector(x, y);
			this.vel = p.createVector(3, -2);
			this.acc = p.createVector();    // Creates a vector of default values (0,0)
			this.mass = m;
			this.r = m * 0.875;
			this.D = this.r * 2;
		}
	
		update() {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			// bounceEdges() is called after the reset, since the effect of friction
			// applied in bounceEdges() is only used in the next frame 
			this.bounceEdges();
		}
	
		show() {
			p.circle(this.pos.x, this.pos.y, this.D);
		}
	
		applyForce(force) {
			// Since we may not want to directly affect the vector that is passed to us 
			// we have to create a copy apply second law to the copied vector
			let f = p5.Vector.div(force, this.mass);
			this.acc.add(f);
		}
	
		bounceEdges(fric_Force = true) {
			if (this.pos.y + this.r > p.height) {
				this.vel.y *= -0.85;
				this.pos.y += p.height - (this.pos.y + this.r);
	
				if (fric_Force) {
					let fric = p5.Vector.setMag(this.vel, fric_coeff); 
					fric.mult(-1);
					this.applyForce(fric);
				}
			} else if (this.pos.y - this.r < 0) {
				this.vel.y *= -0.85;
				this.pos.y -= this.pos.y - this.r
			}
	
			if (this.pos.x + this.r > p.width) {
				this.vel.x *= -0.95;
				this.pos.x += p.width - (this.pos.x + this.r);
			} else if (this.pos.x - this.r < 0) {
				this.vel.x *= -0.95;
				this.pos.x -= this.pos.x - this.r;
			}
		}
	}
	
	let mv = new Mover(250, 80, 20);
	let gravity = p.createVector(0, 0.1);
	const fric_coeff = 0.075;

	p.initializeSketch = function() {
		p.background(220);
		mv.pos.set(250,80);
		mv.vel.set(3, -2);
		p.redraw();
	
	}
	p.setup = function() {	
		p.noLoop();

		p.createCanvas(500, 400);
		p.fill(100);
		// Setup slider for - magnitude of gravity and
		// checkbox for frictional force
		p.initializeSketch();
	}
	
	p.draw = function() {
		p.background(220);
		mv.show();
		mv.applyForce(p5.Vector.mult(gravity, mv.mass));

		mv.update();
	
	}
}

let mySketch = new p5(bouncingBallScript, 'test1');