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
	
		bounceEdges(fric_Force = fricCheckBox.checked()) {
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

	let gravityMagSlider, fricCheckBox, container, label1;

	p.initializeSketch = function() {
		mv.pos.set(250,80);
		mv.vel.set(3, -2);
		p.redraw();
	
	}
	p.setup = function() {	
		p.noLoop();

		let cnv = p.createCanvas(500, 400);
		cnv.parent('test1');
		
		p.fill(100);
		container = document.getElementById('interactive-controls');

		gravityMagSlider = p.createSlider(0, 1, 0.1, 0.05);
		gravityMagSlider.parent(container);
		label1 = p.createSpan('Mag(gravity): '+ gravityMagSlider.value());
		label1.parent(container);

		fricCheckBox = p.createCheckbox('Activate Friction', true);
		fricCheckBox.parent(container);

		gravityMagSlider.input(() =>{
			label1.html('Mag(gravity): '+ gravityMagSlider.value());
			gravity.set(0, gravityMagSlider.value());
		})

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