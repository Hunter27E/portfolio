# Explanation of Blog CRUD Operations

I implemented Authorization and CRUD operations on the blog of my site using Firebase Auth and Firestore, respectively.

I used one JS module to outline the authorization process and another JS module to outline the CRUD operations on the database.

Any visitor to my site is able to view the posts on my blog site, however only authorized users are allowed to add/update/delete blogs. Users are not allowed to sign up, so authorized users are added manually by me with a predefined email and password.

Once a user is logged in they are only allowed to update/delete posts that were created by them. Any authorized user can add a blog post. This way of functioning makes sense to me because maybe multiple users can contribute to the blog, however users should not be able to make changes to another user's blogs. This might not always be the best implementation, maybe in the case that you wanted a more community-like blog where a user could contribute to another user's blog then you would want open access across all blogs, however I did not choose to implement my blog this way.

I chose to check this by checking if a blog with the given blog's ID exists under the current user's name in the database. Another way to do this may have been to store the unique user ID in the blog itself and check if it matched that of the current signed-in user, but my approach felt more natural and straight-forward.

Upon any addition, update, deletion of a blog, the user is first re-authenticated by checking the signed-in status of the user. This makes sense because it prevents users from opening the add/update/delete modals through browser dev tools and making unauthorized changes to the blog database.

**Note: Blog will not function properly on a browser other than Chrome Desktop, because dialog elements are not supported on other browsers. As per HW4 I figured this was acceptable as I'm sure we were supposed to build on the blog/alert implementations from that assignment.**
