const articles = document.querySelectorAll('article');

const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.toggle('show');
				console.log('intersecting');
				observer.unobserve(entry.target);
			}
		});
	},
	{
		root: null,
		threshold: 0,
		rootMargin: '-25px',
	}
);

articles.forEach((article) => {
	observer.observe(article);
});
