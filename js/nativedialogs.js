// callback for Alert button being clicked
const clickAlert = () => {
	document.getElementById('outputVal').innerHTML = '';
	setTimeout(function () {
		alert('Alert: This is an alert!');
	}, 50);
};

// callback for Confirm button being clicked
const clickConfirm = () => {
	document.getElementById('outputVal').innerHTML = '';
	setTimeout(function () {
		let confirmed = confirm('Confirm?');
		document.getElementById(
			'outputVal'
		).innerHTML = `Confirmed Result: ${confirmed}`;
	}, 50);
};

// callback for Prompt button being clicked
// Prompt does not sanitize user input, it is potentially dangerous
const clickPrompt = () => {
	document.getElementById('outputVal').innerHTML = '';
	setTimeout(function () {
		let res = prompt('You are being prompted - input something.');
		if (res == null || res == '') {
			document.getElementById('outputVal').innerHTML = 'No response to prompt';
		} else {
			document.getElementById(
				'outputVal'
			).innerHTML = `Prompt Response: ${res}`;
		}
	}, 50);
};

// callback for Safe Prompt button being clicked
// Safer Prompt sanitizes user input, and thus is safer
const clickSaferPrompt = () => {
	document.getElementById('outputVal').innerHTML = '';
	setTimeout(function () {
		let res = prompt('You are being prompted, safely - input something.');
		if (res == null || res == '') {
			document.getElementById('outputVal').innerHTML =
				'No response to safer prompt';
		} else {
			let cleanRes = DOMPurify.sanitize(res);
			document.getElementById(
				'outputVal'
			).innerHTML = `Safer Prompt Response: ${cleanRes}`;
		}
	}, 50);
};

// declare all event listeners to be added to browser window
function addListeners() {
	document.getElementById('alert').addEventListener('click', clickAlert, true);
	document
		.getElementById('confirm')
		.addEventListener('click', clickConfirm, true);
	document
		.getElementById('prompt')
		.addEventListener('click', clickPrompt, true);
	document
		.getElementById('saferPrompt')
		.addEventListener('click', clickSaferPrompt, true);
}

// add event listeners to browser window
window.addEventListener('load', addListeners, true);
