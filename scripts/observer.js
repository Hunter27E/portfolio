function init() {
	/* Project Cards & Aboout Me Slides intersection observer */
	let elems = document.querySelectorAll('.proj, .slide');
	let show_observer = new IntersectionObserver(
		function (entries, observer) {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				entry.target.classList.toggle('show');
				observer.unobserve(entry.target);
			});
		},
		{
			root: null,
			rootMargin: '-100px',
			threshold: 0.1,
		}
	);
	elems.forEach((proj) => {
		show_observer.observe(proj);
	});
}

window.addEventListener('load', init, true);
