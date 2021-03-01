import { data } from '../data/blogs.js';

/* ************************ GENERAL FNS ****************************** */

/**
 * Updates local storage by performing the add/update/delete on the appropriate
 * blog
 * @param action - action to perform on LS (A, U, D)
 * @param title - title of blog to update/delete
 * @param oldTitle - old title of blog that was updated
 * @param date - date for blog being added
 * @param desc - desc of blog to update/delete
 */
function updateLocalStorage(action, title, oldTitle, date, desc) {
	let ls = localStorage.getItem('blogs');
	let lsArray = JSON.parse(ls);
	if (action == 'A') {
		lsArray.push({ title: title, date: date, desc: desc });
	} else if (action == 'U') {
		// find corresponding post and update its title and description
		let i = 0;
		for (i = 0; i < lsArray.length; i++) {
			let b = lsArray[i];
			if (b.title == oldTitle) {
				b.title = title;
				b.desc = desc;
			}
		}
	} else if (action == 'D') {
		// delete the post with matching title and description
		let i = 0;
		for (i = 0; i < lsArray.length; i++) {
			let b = lsArray[i];
			if (b.title == title && b.desc == desc) {
				// delete corresponding elem from array
				lsArray.splice(i, 1);
				break;
			}
		}
	}
	localStorage.setItem('blogs', JSON.stringify(lsArray));
}

/**
 * Removes buttons from modal upon closing
 * @param modalName - modal to remove button click listeners from
 */
function removeListeners(modalName) {
	let selector1 = `#${modalName} button:first-of-type`;
	let selector2 = `#${modalName} button:last-child`;
	let btn1 = document.querySelector(selector1);
	let btn2 = document.querySelector(selector2);
	switch (modalName) {
		case 'addModal':
			btn1.removeEventListener('click', closeAddModal, true);
			btn2.removeEventListener('click', finishAdd, true);
			break;
		case 'updateModal':
			btn1.removeEventListener('click', closeUpdateModal, true);
			btn2.removeEventListener('click', finishUpdate, true);
			break;
		case 'deleteModal':
			btn1.removeEventListener('click', closeDeleteModal, true);
			btn2.removeEventListener('click', finishDelete, true);
			break;
		default:
			console.log(`${modalName} listeners not deleted`);
			break;
	}
}

/**
 * Reverts modal to normal state and closes it
 * @param modalName - id of modal to close
 */
function closeModal(modalName) {
	// enable rest of screen again
	document.querySelector('div').style.display = 'none';
	// remove modal button listeners
	removeListeners(modalName);
	// close delete modal
	if (modalName == 'deleteModal') {
		let delModal = document.getElementById(modalName);
		delModal.removeAttribute('open');
		return;
	}
	// close add/update modal
	let title = document.querySelector(`#${modalName} input`);
	let desc = document.querySelector(`#${modalName} textarea`);
	title.style.borderColor = 'black';
	title.value = '';
	desc.style.borderColor = 'black';
	desc.value = '';
	let modal = document.getElementById(modalName);
	modal.removeAttribute('open');
}

/**
 * Warns the user that they must input all info before adding blog
 */
function warnModal(modalName) {
	let title = document.querySelector(`#${modalName} input`);
	let desc = document.querySelector(`#${modalName} textarea`);
	title.style.borderColor = 'red';
	desc.style.borderColor = 'red';
}

/* ************************ ADD BLOG ****************************** */

/**
 * Adds blog after user inputs all information
 */
const finishAdd = () => {
	// get info for new blog post
	let titleInput = document.querySelector('#addModal input').value;
	let dateInput = new Date();
	let descInput = document.getElementById('descAdd').value;
	if (titleInput != '' && descInput != '') {
		// all fields filled out, add the blog to blogs array
		updateLocalStorage('A', titleInput, '', dateInput, descInput);
		// add new blog to html
		let main = document.querySelector('main');
		main.appendChild(
			createBlog({ title: titleInput, date: dateInput, desc: descInput })
		);
		closeModal('addModal');
	} else {
		// warn the user to fill out all fields (with styles)
		warnModal('addModal');
	}
};

/**
 * event listener function for closing Add Post modal
 */
function closeAddModal() {
	closeModal('addModal');
}

/**
 * handles Add Blog Post button click
 */
const addBlog = () => {
	// open modal
	let modal = document.getElementById('addModal');
	modal.setAttribute('open', 'true');
	// disable rest of screen
	document.querySelector('div').style.display = 'block';
	// add event listeners to cancel/add buttons
	document
		.querySelector('#addModal button:first-of-type')
		.addEventListener('click', closeAddModal, true);
	document
		.querySelector('#addModal button:last-child')
		.addEventListener('click', finishAdd, true);
};

/* ************************ UPDATE BLOG ****************************** */

/**
 * Update the blog that was clicked on, update the JS array as well
 */
const finishUpdate = () => {
	// retrieve the values in the input fields
	let title = document.querySelector('#updateModal input').value;
	let desc = document.querySelector('#updateModal textarea').value;
	if (title != '' && desc != '') {
		let blog = document.getElementsByName('updatethis')[0];
		let oldTitle = blog.id;
		// update the title and description of blog
		blog.children[0].textContent = title;
		blog.children[2].textContent = desc;
		blog.id = title;
		closeModal('updateModal');
		// update corresponding blog in LS
		updateLocalStorage('U', title, oldTitle, '', desc);
	} else {
		// user must provide every field
		warnModal('updateModal');
	}
};

function closeUpdateModal() {
	let noMoreUpdate = document.getElementsByName('updatethis')[0];
	noMoreUpdate.removeAttribute('name');
	closeModal('updateModal');
}

/**
 * updates blog pertaining to button that was clicked
 * @param event - button that was clicked
 */
const updateBlog = (e) => {
	// get blog being updated
	let blog = e.target.previousElementSibling;
	// save blog to be updated somewhere
	blog.setAttribute('name', 'updatethis');
	// open modal
	let modal = document.getElementById('updateModal');
	modal.setAttribute('open', 'true');
	// disable rest of screen
	document.querySelector('div').style.display = 'block';
	// preset the modal info to data from blog being updated
	let title = document.querySelector('#updateModal input');
	let desc = document.querySelector('#updateModal textarea');
	title.value = blog.id;
	desc.value = blog.children[2].textContent;
	// add event listeners to cancel/save buttons
	document
		.querySelector('#updateModal button:first-of-type')
		.addEventListener('click', closeUpdateModal, true);
	document
		.querySelector('#updateModal button:last-child')
		.addEventListener('click', finishUpdate, true);
};

/* ************************ DELETE BLOG ****************************** */

/**
 * Deletes the blog of the button that was pressed
 */
const finishDelete = () => {
	// get blog to be deleted
	let blog = document.getElementsByName('deletethis')[0];
	// delete blog from JS array
	updateLocalStorage('D', blog.id, '', '', blog.lastElementChild.textContent);
	// delete update/delete buttons from DOM
	blog.parentElement.removeChild(blog.nextElementSibling.nextElementSibling); // delete btn
	blog.parentElement.removeChild(blog.nextElementSibling); // update btn
	// delete from DOM
	blog.parentElement.removeChild(blog);
	closeModal('deleteModal');
};

function closeDeleteModal() {
	let noMoreDelete = document.getElementsByName('deletethis')[0];
	noMoreDelete.removeAttribute('name');
	closeModal('deleteModal');
}

/**
 * deletes blog pertaining to button that was clicked
 * @param event - button that was clicked
 */
const deleteBlog = (e) => {
	// get the blog corresponding the delete button pressed
	let blog = e.target.previousElementSibling.previousElementSibling;
	// save blog to be updated somewhere
	blog.setAttribute('name', 'deletethis');
	// show modal
	let modal = document.getElementById('deleteModal');
	modal.setAttribute('open', 'true');
	// disable rest of screen
	document.querySelector('div').style.display = 'block';
	// add event listeners to cancel/confirm buttons
	document
		.querySelector('#deleteModal button:first-of-type')
		.addEventListener('click', closeDeleteModal, true);
	document
		.querySelector('#deleteModal button:last-child')
		.addEventListener('click', finishDelete, true);
};

/* ************************* INIT **************************** */

/**
 * Creates a new blog post to be added to webpage
 * @param blog - JSON blog obj
 * @returns fragment containing all new blog post HTML
 */
function createBlog(blog) {
	let frag = document.createDocumentFragment();
	// create details element for rest of blog info to be embedded inside
	let details = document.createElement('details');
	details.id = blog.title;
	// details.open = true;
	let summary = document.createElement('summary');
	summary.textContent = blog.title;
	let date = document.createElement('p');
	date.textContent = blog.date;
	let desc = document.createElement('p');
	desc.textContent = blog.desc;
	// embed summary (title), data, desc into details
	details.appendChild(summary);
	details.appendChild(date);
	details.appendChild(desc);
	// add details to fragment
	frag.appendChild(details);
	// create buttons to update/delete this blog post
	let update = document.createElement('button');
	update.textContent = 'Update';
	update.addEventListener('click', updateBlog, true);
	let del = document.createElement('button');
	del.textContent = 'Delete';
	del.addEventListener('click', deleteBlog, true);
	// add buttons to fragment
	frag.appendChild(update);
	frag.appendChild(del);
	return frag;
}

/**
 * Pre-populate the blogs (on first site visit)
 */
function prepopLS() {
	let main = document.querySelector('main');
	let revisiting = localStorage.getItem('visited');
	// check if user has visited site before
	if (revisiting == null) {
		// add all the pre-poulated data only
		localStorage.setItem('visited', 'true');
		// create fragment for each blog and append to main
		data.forEach((blog) => {
			main.appendChild(createBlog(blog));
		});
		// add pre-populated data to LS for future use
		localStorage.setItem('blogs', JSON.stringify(data));
	} else {
		// add all the content from Local Storage only
		let lsData = localStorage.getItem('blogs');
		let lsArray = JSON.parse(lsData);
		lsArray.forEach((blog) => {
			main.appendChild(createBlog(blog));
		});
	}
}

/**
 * Renders preset blogs to screen, sets up onClick listeners
 */
function init() {
	prepopLS();
	document.getElementById('add').addEventListener('click', addBlog, true);
}

window.addEventListener('load', init, true);
