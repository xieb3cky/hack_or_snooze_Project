"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = false) {
  console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  //checks if there's a user logged in
  const user = Boolean(currentUser);

  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${user ? heartHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/************PART TWO : Handle submitting new story form. ***********/

async function submitNewStory(e) {
  console.debug("submitNewStory");
  e.preventDefault();
  // get data from new story form
  const title = $("#title").val();
  const url = $("#url").val();
  const author = $("#author").val();
  const storyObj = { title, url, author };
  const story = await storyList.addStory(currentUser, storyObj);
  //generate new story HTML
  const $newStoryLi = generateStoryMarkup(story);
  $allStoriesList.prepend($newStoryLi);
  //reset form
  $("#title").val('');
  $("#url").val('');
  $("#author").val('');
  //hide form show all stories
  $submitForm.hide();
  $allStoriesList.show();
}
//listen on form for submit
$submitForm.on("submit", submitNewStory);

/************END OF PART TWO ****************************/
/************PART THREE : Handle favorite story on page***********/

/** create heart HTML */
function heartHTML(story, user) {
  //checks if story is in user's favorite 
  const isFavorite = user.isFavorite(story);
  //set heart type (filled or unfilled)
  const heartType = isFavorite ? "fas" : "far";
  return `
      <span class="heart">
        <i class="${heartType} fa-heart"></i>
      </span>`;
}

/** Put favorite stories on page. */
function favoriteStoriesOnPage() {
  console.debug("favoriteStoriesOnPage");
  $favoritedStories.empty();
  if (currentUser.favorites.length === 0) {
    $favoritedStories.append("<h4>No favorites added</h4>");
  } else {
    // loop through users favorites 
    for (let story of currentUser.favorites) {
      //generate HTML for each favorite story
      const $story = generateStoryMarkup(story);
      //append the story to favoritedStories section
      $favoritedStories.append($story);
    }
  }
  //show favorite stories
  $favoritedStories.show();
}


/** Handle favorite/un-favorite a story */
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");
  const $tgt = $(evt.target);
  //event target closest li (story)
  const $closestLi = $tgt.closest("li");
  //get the story id
  const storyId = $closestLi.attr("id");
  //find the the story in stories array
  const story = storyList.stories.find(s => s.storyId === storyId);
  //toggles filled heart 
  if ($tgt.hasClass("fas")) {
    //remove from user's favorite list & change heart
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // else add to user's favorite story array
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}
$storiesLists.on("click", ".heart", toggleStoryFavorite);


/************END OF PART THREE ****************************/
/************PART FOUR removing stories ****************************/

/** Make delete button HTML for story */
function getDeleteBtnHTML() {
  return `
      <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
      </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  $allStoriesList.empty();
  // loop through all of user's stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

/** Handle deleting a story. */
async function deleteStory(evt) {
  console.debug("deleteStory");
  //target closest li (story)
  const $closestLi = $(evt.target).closest("li");
  //get story id
  const storyId = $closestLi.attr("id");
  //remove story from user's story 
  await storyList.removeStory(currentUser, storyId);
  // re-generate story list
  putUserStoriesOnPage();
}
$ownStories.on("click", ".trash-can", deleteStory);

/**  add user's stories on page*/
function putUserStoriesOnPage() {
  console.debug("putUserStoriesOnPage");
  $ownStories.empty();
  if (currentUser.ownStories.length === 0) {
    $ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {
    // loop through all of users stories and generate HTML for them
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}
/************END OF PART FOUR ****************************/