var firebaseConfig = {
	apiKey: 'AIzaSyCIlxR5oi_HNTbKfemD8Kl9u7fCBlA05lw',
	authDomain: 'portfolio-he.firebaseapp.com',
	projectId: 'portfolio-he',
	storageBucket: 'portfolio-he.appspot.com',
	messagingSenderId: '39582117093',
	appId: '1:39582117093:web:9700fafbf8032406ba780c',
};

firebase.initializeApp(firebaseConfig);

export var auth = {
	signedin: false,
	user: firebase.auth(),
};

// set observer on Auth obj
firebase.auth().onAuthStateChanged(function (user) {
	let is = document.querySelectorAll('i');
	let signedInSection = document.querySelector('#signedin');
	let signedOutSection = document.querySelector('#signedout');
	if (user) {
		auth.signedin = true;
		// get email of user
		let email = firebase.auth().currentUser.email;
		// show functions for signed in users
		signedInSection.style.display = 'block';
		let status = document.querySelector('#signedin p');
		status.textContent = `You are signed in with ${email}`;
		is.forEach((i) => (i.style.visibility = 'visible'));
		// hide functions for signed out users
		signedOutSection.style.display = 'none';
	} else {
		auth.signedin = false;
		// show functions for signed out users
		signedOutSection.style.display = 'block';
		// hide functiosn for signed in users
		signedInSection.style.display = 'none';
		is.forEach((i) => (i.style.visibility = 'hidden'));
	}
});

function handleSignIn() {
	let email = document.getElementsByName('email')[0].value;
	let pass = document.getElementsByName('pass')[0].value;
	firebase
		.auth()
		.signInWithEmailAndPassword(email, pass)
		.then((userCredential) => {
			auth.user = firebase.auth();
		})
		.catch((error) => {
			alert('Error: ' + error.message);
		});
}

function handleSignOut() {
	firebase
		.auth()
		.signOut()
		.catch((error) => {
			alert('Error: ' + error.message);
		});
}

function init() {
	// add click listener to sign in button
	let signin = document.querySelector('#signin');
	signin.addEventListener('click', handleSignIn, true);
	// add click listener to sign out button
	let signout = document.querySelector('#signout');
	signout.addEventListener('click', handleSignOut, true);
}

document.addEventListener('load', init, true);
