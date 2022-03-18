const articles = document.querySelectorAll('article');

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
		threshold: 0.2,
		rootMargin: '0px',
	}
);

articles.forEach((article) => {
	observer.observe(article);
});
