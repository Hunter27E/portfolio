function show(e) {
	console.dir(e.target);
	console.log(e.target.attributes['data-grid-area'].value);
}

function init() {
	document.getElementById('grand-p').addEventListener('mouseover', show, true);
}

window.addEventListener('load', init, true);
