"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}




/************PART TWO***********/
/** Show story submit form on clicking navbar 'submit' */

function navSubmit() {
  console.debug("navSubmit");
  hidePageComponents();
  $allStoriesList.show();
  $submitForm.show();
}

$navSubmitStory.on("click", navSubmit)

/************PART THREE***********/
/** Show favorite stories on click on "favorites" */

function navFavorites(e) {
  console.debug("navFavorites", e);
  hidePageComponents();
  favoriteStoriesOnPage();
}

$navFavoritedStories.on('click', navFavorites)

/************PART FOUR***********/

/** Show My Stories on clicking "my stories" */
function navMyStories(evt) {
  console.debug("navMyStories", evt);
  hidePageComponents();
  putUserStoriesOnPage();
  $ownStories.show();
}

$navOwnStories.on('click', navMyStories)