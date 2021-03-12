// firebase obj initialized in auth.js
import { auth } from './auth.js';
var db = firebase.firestore();

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'June',
	'July',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

/******************* GENERIC FUNCTIONS *******************/

/**
 * Converts a Firestore doc to an HTML blog and adds it to the DOM
 * @param blog - firebase doc to turn into blog
 */
function renderArticle(blog) {
	let article = document.createElement('article');
	article.setAttribute('class', 'blogCard');
	let h2 = document.createElement('h2');
	h2.textContent = blog.title;
	article.appendChild(h2);
	let content = document.createElement('section');
	let desc = document.createElement('p');
	desc.textContent = blog.description;
	content.appendChild(desc);
	let date_author = document.createElement('p');
	date_author.textContent = `By ${blog.author} - ${blog.date}`;
	content.appendChild(date_author);
	let id = document.createElement('p');
	id.style.display = 'none';
	id.style.margin = 0;
	id.textContent = blog.id;
	content.appendChild(id);
	let edit = document.createElement('i');
	edit.setAttribute('class', 'material-icons');
	edit.textContent = 'edit';
	edit.addEventListener('click', openUpdateDialog, true);
	content.appendChild(edit);
	let del = document.createElement('i');
	del.setAttribute('class', 'material-icons');
	del.textContent = 'delete';
	del.addEventListener('click', openDeleteDialog, true);
	content.appendChild(del);
	article.appendChild(content);
	let blogs = document.querySelector('#blogs');
	blogs.insertBefore(article, blogs.firstElementChild);
}

/**
 * Gets blogs from Firestore and displays them
 */
function fetchBlogs() {
	console.log('Im here');
	// remove all blogs first
	let currBlogs = document.querySelector('#blogs');
	currBlogs.childNodes.forEach((child) => {
		currBlogs.removeChild(child);
	});
	// get all blogs from 'blogs' collectionGroup
	let allBlogs = db.collectionGroup('blogs');
	allBlogs.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			renderArticle(doc.data());
		});
	});
}

function toggleDisabler() {
	let disabler = document.querySelector('#disabler');
	let active = disabler.style.display == 'block';
	disabler.style.display = active ? 'none' : 'block';
}

/******************* UPDATE BLOG *******************/

function updateBlog() {}
function closeUpdateDialog() {}
function openUpdateDialog() {}

/******************* DELETE BLOG *******************/

function deleteBlog() {}
function closeDeleteDialog() {}
function openDeleteDialog() {}

/******************* ADD BLOG *******************/

function addBlog() {
	let title = document.querySelector('#addDialog input').value;
	let desc = document.querySelector('#addDialog textarea').value;
	if (auth.user.currentUser != null && title != '' && desc != '') {
		let user = auth.user.currentUser;
		let date = new Date();
		date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		let author = user.email;
		let blogID = Math.floor(Math.random() * 1000000);
		// creates doc for blog if it doesn't exist, updates it otherwise
		db.doc(`users/${user.uid}/blogs/${blogID}`)
			.set({
				id: blogID,
				title: title,
				description: desc,
				author: author,
				date: date,
			})
			.then(() => console.log('Blog added!'))
			.catch((e) => console.log(error));
	}
	closeAddDialog();
}

function closeAddDialog() {
	toggleDisabler();
	document.querySelector('#addDialog').removeAttribute('open');
	let cancel = document.querySelector('#addDialog i:first-of-type');
	cancel.removeEventListener('click', closeAddDialog, true);
	let confirm = document.querySelector('#addDialog i:last-child');
	confirm.removeEventListener('click', addBlog, true);
}

function openAddDialog() {
	toggleDisabler();
	document.querySelector('#addDialog').setAttribute('open', 'true');
	let cancel = document.querySelector('#addDialog i:first-of-type');
	cancel.addEventListener('click', closeAddDialog, true);
	let confirm = document.querySelector('#addDialog i:last-child');
	confirm.addEventListener('click', addBlog, true);
}

/******************* INIT *******************/

function init() {
	let addBtn = document.querySelector('#add');
	addBtn.addEventListener('click', openAddDialog, true);
	fetchBlogs();
}

window.addEventListener('load', init, true);
