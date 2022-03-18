const pitch_heading = document.querySelectorAll('#pitch h2 > span');
const services_cards = document.querySelectorAll('.services__card');

/* root, rootMargin, threshold */
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.toggle('show');
				observer.unobserve(entry.target);
			}
		});
	},
	{
		root: null,
		threshold: 1,
		rootMargin: '0px',
	}
);

pitch_heading.forEach((line) => {
	observer.observe(line);
});

services_cards.forEach((card) => {
	observer.observe(card);
});
