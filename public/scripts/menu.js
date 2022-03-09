function toggle_menu(e) {
	/* open/close nav */
	let menu = document.querySelector('#menu');
	menu.classList.toggle('open');
	let body = document.querySelector('body');
	body.style.position = body.style.position == 'fixed' ? 'relative' : 'fixed';
}

function init() {
	// nav btns
	let bars = document.querySelector('.fa-bars');
	bars.addEventListener('click', toggle_menu, true);
	let x_close = document.querySelector('.fa-circle-xmark');
	x_close.addEventListener('click', toggle_menu, true);
}

window.addEventListener('load', init, true);
