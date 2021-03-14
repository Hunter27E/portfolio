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
 * Shows warning dialog with the given id
 * @param id - id of dialog to show the user
 */
function warnUser(id) {
	let errorDialog = document.querySelector(`#${id}`);
	errorDialog.setAttribute('open', 'true');
	setTimeout(function () {
		errorDialog.removeAttribute('open');
	}, 3000);
}

/**
 * Converts a Firestore doc to an HTML blog and adds it to the DOM
 * @param blog - firebase doc to turn into blog
 */
function renderArticle(blog, fireID) {
	let article = document.createElement('article');
	article.setAttribute('class', 'blogCard');
	article.setAttribute('id', fireID);
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
	// remove all blogs first
	let currBlogs = document.querySelector('#blogs');
	let numChildren = currBlogs.children.length;
	for (let i = 0; i < numChildren; i++) {
		currBlogs.removeChild(currBlogs.children[0]);
	}
	// get all blogs from 'blogs' collectionGroup
	let allBlogs = db.collectionGroup('blogs');
	allBlogs.get().then((querySnapshot) => {
		querySnapshot.forEach((doc) => {
			// console.log(doc.data());
			renderArticle(doc.data(), doc.id);
		});
		let is = document.querySelectorAll('i');
		// fixes refreshing page when user is signed out and update/delete icons are visible
		if (auth.user.currentUser != null) {
			// show icons
			is.forEach((i) => (i.style.visibility = 'visible'));
		} else {
			// hide icons
			is.forEach((i) => (i.style.visibility = 'hidden'));
		}
	});
}

function toggleDisabler() {
	let disabler = document.querySelector('#disabler');
	let active = disabler.style.display == 'block';
	disabler.style.display = active ? 'none' : 'block';
}

/******************* UPDATE BLOG *******************/

var blog2update;

function updateBlog() {
	// update the blog with the new information
	// make sure user enters all fields
	// make sure only owner of the blog can update
	let newTitle = document.querySelector('#updateDialog input').value;
	let newDesc = document.querySelector('#updateDialog textarea').value;
	if (auth.user.currentUser != null && newTitle != '' && newDesc != '') {
		let author = auth.user.currentUser.email;
		let date = new Date(); // date updated
		date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		let blogID = blog2update.id;
		let userID = auth.user.currentUser.uid;
		let docRef = db.doc(`users/${userID}/blogs/${blogID}`);
		docRef
			.get()
			.then((docSnap) => {
				if (docSnap.exists) {
					docRef
						.set({
							author: author,
							date: date, // new date
							title: newTitle,
							description: newDesc,
						})
						.then(() => {
							closeUpdateDialog();
							fetchBlogs();
							console.log(`Updated Blog! ID = ${blogID}`);
						});
				} else {
					// blog did not exist under this user - show update error
					warnUser('updateNotOwner');
					closeUpdateDialog();
				}
			})
			.catch((e) => console.log(e));
	} else {
		// warn user to fill out all fields
		warnUser('updateError');
		// dont close dialog, allow them to input rest of info
	}
}

function closeUpdateDialog() {
	toggleDisabler();
	let cancel = document.querySelector('#updateDialog i:first-of-type');
	cancel.removeEventListener('click', closeUpdateDialog, true);
	let confirm = document.querySelector('#updateDialog i:last-child');
	confirm.removeEventListener('click', updateBlog, true);
	document.querySelector('#updateDialog').removeAttribute('open');
}

function openUpdateDialog(e) {
	toggleDisabler();
	blog2update = e.target.parentElement.parentElement;
	document.querySelector('#updateDialog').setAttribute('open', 'true');
	// prepopulate update input fields with blog data
	let blogID = blog2update.id;
	let title = document.querySelector(`[id="${blogID}"] h2`);
	let description = document.querySelector(`[id="${blogID}"] p:first-child`);
	let input = document.querySelector('#updateDialog input');
	input.value = title.textContent;
	let textarea = document.querySelector('#updateDialog textarea');
	textarea.value = description.textContent;
	// add event listeners to cancel/confirm buttons
	let cancel = document.querySelector('#updateDialog i:first-of-type');
	cancel.addEventListener('click', closeUpdateDialog, true);
	let confirm = document.querySelector('#updateDialog i:last-child');
	confirm.addEventListener('click', updateBlog, true);
}

/******************* DELETE BLOG *******************/

var blog2del; // most recent blog that had its trash can clicked

function deleteBlog() {
	// delete the blog if signed-in user is author of the blog
	// otherwise tell the user they can't delete it because it does not belong to them
	// only allow deletions if user is logged in
	if (auth.user.currentUser != null) {
		let userID = auth.user.currentUser.uid;
		let blogID = blog2del.id;
		let docRef = db.doc(`users/${userID}/blogs/${blogID}`);
		// check if blog belongs to this user, if so delete
		docRef
			.get()
			.then((docSnap) => {
				// delete blog if exists
				if (docSnap.exists) {
					docRef
						.delete()
						.then(() => {
							fetchBlogs();
							console.log(`Blog deleted! ID = ${blogID}`);
						})
						.catch((e) => console.log(e));
				} else {
					// blog did not exist under this user - show delete error
					warnUser('delError');
				}
			})
			.catch((e) => console.log(e));
	}
	closeDeleteDialog();
}

function closeDeleteDialog() {
	toggleDisabler();
	let cancel = document.querySelector('#deleteDialog i:first-of-type');
	cancel.removeEventListener('click', closeDeleteDialog, true);
	let confirm = document.querySelector('#deleteDialog i:last-child');
	confirm.removeEventListener('click', deleteBlog, true);
	document.querySelector('#deleteDialog').removeAttribute('open');
}

function openDeleteDialog(e) {
	toggleDisabler();
	document.querySelector('#deleteDialog').setAttribute('open', 'true');
	let cancel = document.querySelector('#deleteDialog i:first-of-type');
	cancel.addEventListener('click', closeDeleteDialog, true);
	let confirm = document.querySelector('#deleteDialog i:last-child');
	confirm.addEventListener('click', deleteBlog, true);
	// save blog user is trying to delete
	blog2del = e.target.parentElement.parentElement;
}

/******************* ADD BLOG *******************/

function addBlog() {
	let title = document.querySelector('#addDialog input').value;
	let desc = document.querySelector('#addDialog textarea').value;
	if (auth.user.currentUser != null && title != '' && desc != '') {
		let user = auth.user.currentUser;
		let date = new Date();
		date = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
		let author = user.email;
		// creates doc for blog if it doesn't exist, updates it otherwise
		// uses auto-generated id for blog
		db.collection(`users/${user.uid}/blogs`)
			.add({
				title: title,
				description: desc,
				author: author,
				date: date,
			})
			.then((docRef) => {
				closeAddDialog();
				fetchBlogs();
				console.log(`Blog added! ID = ${docRef.id}`);
			})
			.catch((e) => console.log(e));
	} else {
		warnUser('addError');
		// dont close dialog, allow them to input rest of info
	}
}

function closeAddDialog() {
	toggleDisabler();
	document.querySelector('#addDialog input').value = '';
	document.querySelector('#addDialog textarea').value = '';
	let cancel = document.querySelector('#addDialog i:first-of-type');
	cancel.removeEventListener('click', closeAddDialog, true);
	let confirm = document.querySelector('#addDialog i:last-child');
	confirm.removeEventListener('click', addBlog, true);
	document.querySelector('#addDialog').removeAttribute('open');
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
