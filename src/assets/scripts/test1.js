// A simple p5js script 'simple_script.js'
let exampleScript = function (p) {
	let ballX = 0;
	let ballSpeed = 1;

	p.intializeSketch = function () {
		// put initialization code here
		ballX = 0;
		ballSpeed = 1;
		p.background(51);
	}

	p.setup = function () {
		p.noLoop();

		p.createCanvas(240, 120);
		p.background(51);

		p.intializeSketch();
	}

	p.draw = function () {
		// put drawing code here
		p.background(51, 10);
		p.stroke(255);
		p.strokeWeight(10);
		p.translate(0, p.height / 2);
		let ang = 2 * p.PI * (ballX / p.width);
		let ballY = p.sin(ang) * p.height / 2.5;
		p.circle(ballX, ballY, 10);
		ballX = (ballX + ballSpeed) % p.width;
	}
}

let mySketch = new p5(exampleScript, 'test1');