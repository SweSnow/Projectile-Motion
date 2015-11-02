'use strict';

var sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, sign = Math.sign, pow = Math.pow, pi = Math.PI;

function rad(x) {
	return x * pi / 180;
}

function deg() {
	return x * 180 / pi;
}

var g = 9.82;

/*
	Returns an array with the results:
		[0]: LaTeX plot
		[1]: Air time
		[2]: Distance
		[3]: Parabola length
		[4]: Max height
		[5]: Initial energy
		[6]: Final energy
		[7]: Reach vs vacuum
*/

function getAirResistanceData(initialVelocity, angle, density, frontArea, drag, mass, initialHeight, samples, compare) {

	var sampleFrequency = 40 / (samples / 100);

	var x = 0;
	var y = initialHeight;

	var v0 = initialVelocity;
	var theta = rad(angle);
	var m = mass;

	var vx = cos(theta) * v0;
	var vy = sin(theta) * v0;

	var dt = 0.001;
	var t = 0;
	var maxY = initialHeight;

	var rho = density;
	var area = frontArea;
	var dragCoefficient = drag;

	var i = 1;
	var length = 0;

	var res = [[x.toFixed(4), y.toFixed(4)]];

	while (true) {		
		var dragVelocity = getAirResistance(rho, area, dragCoefficient, vx, vy, dt, m);

		var x0 = x;
		var y0 = y;

		vx += dragVelocity.x;
		vy += dragVelocity.y;

		vy += -g*dt;

		x += vx * dt;
		y += vy * dt;

		if (y > maxY) {
			maxY = y;
		}

		length += sqrt(pow(x - x0, 2) + pow(y - y0, 2))

		if (y < 0) {
			res.push([x.toFixed(4), y.toFixed(4)]);
			break;
		}
		if ((i % sampleFrequency) == 0) {
			res.push([x.toFixed(4), y.toFixed(4)]);
		}

		t += dt;
		i++;

		if (i > 10000) {
			alert(y);
		}
	}

	var initialEnergy = 0.5 * initialVelocity * initialVelocity * mass + mass * g * initialHeight;
	var finalEnergy = 0.5 * (pow(vx ,2) + pow(vy, 2)) * mass;

	var rangeCompare = 0;

	if (compare) {
		var vRange = getAirResistanceData(initialVelocity, angle, 0, 0, 0, 1, initialHeight, 0, false)[2];
		rangeCompare = ((length/vRange) * 100).toFixed(2);
	}

	return [
	res,
	t.toFixed(2),
	x.toFixed(4),
	length.toFixed(4),
	maxY.toFixed(4),
	initialEnergy.toFixed(4),
	finalEnergy.toFixed(4),
	rangeCompare];
}

function generateBestAngleFromHeightGraph(velocity, fromHeight, toHeight, heightIncrement) {
	var res = '';

	var v0 = parseInt(velocity);
	var ymin = parseInt(fromHeight);
	var ymax = parseInt(toHeight);
	var yplus = parseInt(heightIncrement);

	for (var i = parseInt(ymin); i <= ymax; i += yplus) {
		res += ('(' + i + ', ' + (bestAngleFromStartingHeight(v0, i) * 180 / Math.PI).toFixed(4) + ')<br>');
	}

	return res;
}

function bestAngleFromStartingHeight(v0, y0) {
	var bestLength = 0;
	var bestAngle = 0;
	var lastTheta = 0;

	for (var theta = 0; theta < Math.PI / 4; theta += 0.0001) {
		var time = 0;
		var length = v0*sin(2*theta)/(2*g) + (v0*cos(theta)*sqrt(v0*v0*sin(theta)*sin(theta)+2*g*y0))/(g);

		if (length > bestLength) {
			bestLength = length;
			bestAngle = theta;
		}
	}

	return bestAngle;
}

function getAirResistance(rho, area, dragCoefficient, velocityX, velocityY, deltaT, mass) {
	return new Vec2(
		-0.5 * rho * area * dragCoefficient * velocityX * velocityX * sign(velocityX) * deltaT / mass,
		-0.5 * rho * area * dragCoefficient * velocityY * velocityY * sign(velocityX) * deltaT / mass
	);
}

function Vec2(x, y) {
	this.x = x;
	this.y = y;
}

function x(a, v, t) {
	return v * Math.sin(a) * t;
}

function y(a, v, t) {
	return v * Math.cos(a) * t - 0.5 * g * t * t;
}