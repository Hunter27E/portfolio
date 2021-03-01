// ALERT

const clickAlert = () => {
	clearOutput();
	disableButtons(true);
	// make dialog visible
	let dialog = document.querySelector('dialog');
	dialog.setAttribute('class', 'activated');
	// make custom alert visible
	let template = document.querySelector('template');
	let clone = template.content.cloneNode(true);
	dialog.appendChild(clone);
	// bind listener to dismiss button
	document
		.getElementById('dismissAlert')
		.addEventListener('click', dismissAlert, true);
};

const dismissAlert = () => {
	// remove alert components from DOM and event listeners
	clearDialog();
	disableButtons(false);
};

// CONFIRM

const clickConfirm = () => {
	clearOutput();
	disableButtons(true);
	// make dialog visible
	let dialog = document.querySelector('dialog');
	dialog.setAttribute('class', 'activated');
	// make custom confirm visible
	let template = document.querySelector('dialog template:nth-child(2)');
	let clone = template.content.cloneNode(true);
	dialog.appendChild(clone);
	// bind click listeners to cancel/confirm buttons
	document
		.getElementById('noConfirm')
		.addEventListener('click', dismissConfirm, true);
	document
		.getElementById('yesConfirm')
		.addEventListener('click', dismissConfirm, true);
};

const dismissConfirm = (confirmed) => {
	let output = document.querySelector('output');
	if (confirmed.path[0].id == 'yesConfirm') {
		output.innerHTML = `Confirmed? True.`;
	} else {
		output.innerHTML = `Confirmed? False.`;
	}
	clearDialog();
	disableButtons(false);
};

// PROMPT

const clickPrompt = () => {
	clearOutput();
	disableButtons(true);
	// make dialog visible
	let dialog = document.querySelector('dialog');
	dialog.setAttribute('class', 'activated');
	// render custom prompt
	let template = document.querySelector('dialog template:nth-child(3)');
	let clone = template.content.cloneNode(true);
	dialog.appendChild(clone);
	// bind onclick listeners to prompt buttons
	document
		.getElementById('noPrompt')
		.addEventListener('click', dismissPrompt, true);
	document
		.getElementById('yesPrompt')
		.addEventListener('click', dismissPrompt, true);
};

const dismissPrompt = (res) => {
	let output = document.querySelector('output');
	if (res.path[0].id == 'yesPrompt') {
		// sanitize user input
		let dirtyInput = document.getElementById('promptInput').value;
		if (dirtyInput == null || dirtyInput == '') {
			output.innerHTML = `User inputed nothing.`;
		} else {
			cleanInput = DOMPurify.sanitize(dirtyInput);
			output.innerHTML = `User input: ${cleanInput}`;
		}
		// set output.innerHTML
	} else {
		output.innerHTML = `User inputed nothing.`;
	}
	clearDialog();
	disableButtons(false);
};

// CLEAR DIALOG/OUTPUT

const disableButtons = (disable) => {
	let buttons = document.querySelectorAll('main > button');
	if (disable) {
		// disable rest of screen again
		document.querySelector('main > div').style.display = 'block';
		buttons.forEach((btn) => {
			btn.setAttribute('disabled', 'disabled');
		});
	} else {
		// enable rest of screen again
		document.querySelector('main > div').style.display = 'none';
		buttons.forEach((btn) => {
			btn.removeAttribute('disabled');
		});
	}
};

const clearOutput = () => {
	let output = document.querySelector('output');
	output.innerHTML = '';
};

/*
 * Remove event listeners from alert/confirm/prompt buttons
 * Delete the dialog content from screen
 */
const clearDialog = () => {
	// enable rest of screen again
	document.querySelector('main > div').style.display = 'none';
	let dialog = document.querySelector('dialog');
	// unbind onclick listeners for buttons in dialog
	// content.lastChildElement.children.forEach((elem) => {});
	// delete the dialog content
	dialog.removeChild(dialog.lastElementChild);
	// make dialog invisible
	dialog.removeAttribute('class');
};

// ON PAGE LOAD

// declare button onClick listeners
function addListeners() {
	document.getElementById('alert').addEventListener('click', clickAlert, true);
	document
		.getElementById('confirm')
		.addEventListener('click', clickConfirm, true);
	document
		.getElementById('prompt')
		.addEventListener('click', clickPrompt, true);
}

// bind event listeners to all buttons
window.addEventListener('load', addListeners, true);
