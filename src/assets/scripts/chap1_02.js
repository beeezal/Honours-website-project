let bouncingBallScript = function (p) {
	class Mover {
		constructor(x, y, m) {
			this.pos = p.createVector(x, y);
			this.vel = p.createVector(3, -2);
			this.acc = p.createVector();
			this.mass = m;
			this.r = m * 0.875;
			this.D = this.r * 2;
		}
	
		update() {
			this.vel.add(this.acc);
			this.pos.add(this.vel);
			this.acc.mult(0);
			this.bounceEdges();
		}
	
		show() {
			p.circle(this.pos.x, this.pos.y, this.D);
		}
	
		applyForce(force) {
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
		cnv.parent('sec2');
		
		p.fill(100);
		container = document.getElementById('interactive-controls-sec2');

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
		p.background(255);
		mv.show();
		mv.applyForce(p5.Vector.mult(gravity, mv.mass));

		mv.update();
	
	}
}

let sec2Sketch = new p5(bouncingBallScript, 'sec2');