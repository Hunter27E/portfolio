window.addEventListener('DOMContentLoaded', function () {
	// get form and title of form
	var formTitle = document.querySelector('h1');
	var form = document.querySelector('form');

	// Success and Error functions for after the form is submitted
	function success() {
		form.reset();
		formTitle.textContent = 'Thank You!';
	}

	function error() {
		formTitle.textContent = 'Try Again, Please';
	}

	// handle the form submission event

	form.addEventListener('submit', function (ev) {
		ev.preventDefault();
		var data = new FormData(form);
		ajax(form.method, form.action, data, success, error);
	});
});

// helper function for sending an AJAX request

function ajax(method, url, data, success, error) {
	var xhr = new XMLHttpRequest();
	xhr.open(method, url);
	xhr.setRequestHeader('Accept', 'application/json');
	xhr.onreadystatechange = function () {
		if (xhr.readyState !== XMLHttpRequest.DONE) return;
		if (xhr.status === 200) {
			success(xhr.response, xhr.responseType);
		} else {
			error(xhr.status, xhr.response, xhr.responseType);
		}
	};
	xhr.send(data);
}
