/**
 * Outputs JSON nicely into HTML pre tag
 * @param json - JSON to put into HTML
 */
const outputJSON = (json) => {
	let output = document.getElementsByTagName('pre')[0];
	output.innerHTML = JSON.stringify(json, null, 4);
};

/**
 * Sends a GET/POST/PUT/DELETE request based on the button that was pressed by
 * the user
 * @param e - event that triggered the http request
 */
const sendReq = (e) => {
	let btn = e.target.id;
	// get request HTTP method
	let method = btn.substring(0, btn.indexOf('B'));
	// get info that will be sent in request
	let id = document.getElementsByName('id')[0].value;
	// send GET (cannot have body in request)
	if (method === 'get' || method === 'delete') {
		fetch(`https://httpbin.org/${method}?id=${id}`, {
			method: method,
		})
			.then((res) => res.json())
			.then((json) => {
				outputJSON(json);
			})
			.catch((e) => console.log('Fetch Error'));
	}
	// send POST/PUT
	else {
		// get info that will be sent in request
		let name = document.getElementsByName('art_name')[0].value;
		let body = document.getElementsByName('art_body')[0].value;
		let date = document.getElementsByName('date')[0].value;
		fetch(`https://httpbin.org/${method}`, {
			method: method,
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				id: id,
				name: name,
				body: body,
				date: date,
			}),
		})
			.then((res) => res.json())
			.then((json) => {
				outputJSON(json);
			})
			.catch((e) => console.log('Fetch Error'));
	}
};

/**
 * Add all needed event listeners
 */
function init() {
	// set default date to be NOW
	let dateInput = document.getElementsByName('date')[0];
	dateInput.setAttribute('value', new Date());
	// add event listeners to http buttons
	document.getElementById('postBtn').addEventListener('click', sendReq, true);
	document.getElementById('getBtn').addEventListener('click', sendReq, true);
	document.getElementById('putBtn').addEventListener('click', sendReq, true);
	document.getElementById('deleteBtn').addEventListener('click', sendReq, true);
}

window.addEventListener('DOMContentLoaded', init, true);
