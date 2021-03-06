'use strict';

calculateOptimalAngle();
calculateAirResistance();

function calculateOptimalAngle() {
	var text = generateBestAngleFromHeightGraph(
		$('#optAngInitialVelocity').value,
		$('#optAngFromHeight').value,
		$('#optAngToHeight').value,
		$('#optAngHeightIncrement').value
	);

	var buttonText = '<div class="copy" onclick="copy(this)" data-values="\\addplot coordinates {';
	buttonText += text.replace(/\<br\>/g," ");
	buttonText += '};">Copy</div>';

	$('#optAngOutput').innerHTML = text + buttonText;
}

function calculateAirResistance() {
	var airResOutput = getAirResistanceData (
		parseFloat($('#airResInitialVelocity').value),
		parseFloat($('#airResLaunchAngle').value),
		parseFloat($('#airResAirDensity').value),
		parseFloat($('#airResFrontalArea').value),
		parseFloat($('#airResDragCoefficient').value),
		parseFloat($('#airResMass').value),
		parseFloat($('#airResInitialHeight').value),
		parseFloat($('#airResSampleFreq').value),
		true
	);

	var info 	= 'Air time: ' + airResOutput[1] + ' s<br>'
				+ 'Distance: ' + airResOutput[2] + ' m<br>'
				+ 'Parabola length: ' + airResOutput[3] + ' m<br>'
				+ 'Max height: ' + airResOutput[4] + ' m<br>'
				+ 'Initial energy: ' + airResOutput[5] + ' J<br>'
				+ 'Final energy: ' + airResOutput[6] + ' J<br>'
				+ 'Reach vs vacuum ' + airResOutput[7] + ' %<br><br>';

	
	var text = '';

	for (var i = 0; i < airResOutput[0].length; i++) {
		text += '(' + airResOutput[0][i][0] + ', ' + airResOutput[0][i][1] + ')<br>'
	}

	var buttonText = '<div class="copy" onclick="copy(this)" data-values="\\addplot coordinates {';
	buttonText += text.replace(/\<br\>/g," ");
	buttonText += '};">Copy</div>';

	$('#airResOutput').innerHTML = info + text + buttonText;
}

function copy(element) {
	window.prompt("Copy to clipboard: Ctrl+C, Enter", element.dataset.values);
}

function $(selector) {
	return document.querySelector(selector);
}