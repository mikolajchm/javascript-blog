const optArticleSelector = '.post',
      optTitleSelector = '.post-title',
      optTitleListSelector = '.titles',
      optArticleTagsSelector = '.post-tags .list',
      optArticleAuthorSelector = '.post-author',
      optTagsListSelector = '.tags.list',
      optCloudClassCount = 5,
      optCloudClassPrefix = 'tag-size-',
      optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = ''){
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector);
  titleList.innerHTML = '';
  /* for each article */
  const articles = document.querySelectorAll(optArticleSelector + customSelector);
  let html = '';
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id');
    /* find the title element */
    const titleElement = article.querySelector(optTitleSelector);
    /* get the title from the title element */
    const articleTitle = titleElement.innerHTML;
    /* create HTML of the link */
    const linkHTML = '<li><a href="#' + articleId + '">' + articleTitle + '</a></li>';
    /* insert link into html variable */
    html = html + linkHTML;
  }
  titleList.innerHTML += html;
  /* add event listeners to generated links */
  const links = document.querySelectorAll('.titles a');
  for (let link of links) {
    link.addEventListener('click', titleClickHandler);
  }
}
  const titleClickHandler = function (event) {
    const clickedElement = this;
    console.log('Link was clicked!');
    /* [DONE] remove class 'active' from all article links */
    const activeLinks = document.querySelectorAll('.titles a.active');
    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }
    /* [DONE] add class 'active' to the clicked link */
    clickedElement.classList.add('active');
    console.log('clickedElement:', clickedElement);
    /* [DONE] remove class 'active' from all articles */
    const activeArticles = document.querySelectorAll('.post.active');
    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }
    /* get 'href' attribute from the clicked link */
    const targetArticleSelector = clickedElement.getAttribute('href');
    /* find the correct article using the selector (value of 'href' attribute) */
    const targetArticle = document.querySelector(targetArticleSelector);
    /* add class 'active' to the correct article */
    targetArticle.classList.add('active');
  };
generateTitleLinks();


function calculateTagsParams(tags){
  let params = {
    max: 0,
    min: Infinity,
  };

  for (let tag in tags) {
    if (tags[tag] > params.max) {
      params.max = tags[tag];
    }

    if (tags[tag] < params.min) {
      params.min = tags[tag];
    }
  }

  return params;

}

// func to caculate min and max value of tags
function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;

}


function generateTags(){
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html ='';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for(let tag of articleTagsArray){
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if(!allTags[tag]) {
      /* [NEW] add tag to allTags object */
      allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }

    /* END LOOP: for each tag */
    }
    /* insert HTML of all the links into the tags wrapper */
    if (tagWrapper) {
      tagWrapper.innerHTML += html;
    } 
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams)

  /* [NEW] create variable for all links HTML code */
  let allTagsHTML = '';

  /* [NEW] START LOOP: for each tag in allTags: */
  for (let tag in allTags) {
    const tagLinkHTML = '<li><a href="#tag-' + tag + '" class="' + calculateTagClass(allTags[tag], tagsParams) + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
    console.log('tagLinkHTML:', tagLinkHTML);
    /* [NEW] generate code of a link and add it to allTagsHTML */
    allTagsHTML += tagLinkHTML;
  }
  /* [NEW] END LOOP: for each tag in allTags: */

  /*[NEW] add HTML from allTagsHTML to tagList */
  tagList.innerHTML = allTagsHTML;
  }
}
generateTags();


function tagClickHandler(event){
  /* prevent default action for this event */ 
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[data-tag]');
  /* START LOOP: for each active tag link */
  activeTagLinks.forEach(activeLink => {
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active tag link */
  });
  
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll(`a[href="${href}"]`);
  /* START LOOP: for each found tag link */
  tagLinks.forEach(tagLink => {
    /* add class active */
    tagLink.classList.add('active');
  /* END LOOP: for each found tag link */
  });
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function addClickListenersToTags(){
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  tagLinks.forEach(tagLink => {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  /* END LOOP: for each link */
  });
}
addClickListenersToTags();
function calculateAuthorParams(authors) {
  let params = {
    max: 1,
    min: 4,
  };

  for (let author in authors) {
    if (authors[author] > params.max) {
      params.max = authors[author];
    }

    if (authors[author] < params.min) {
      params.min = authors[author];
    }
  }

  return params;
}

function calculateAuthorClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateAuthors() {
  const articles = document.querySelectorAll(optArticleSelector);
  const authorsList = document.querySelector(optAuthorsListSelector);
  authorsList.innerHTML = ''; // Wyczyść listę autorów przed ponownym generowaniem

  let authorsData = {};

  for (let article of articles) {
    const articleAuthor = article.getAttribute('data-author');

    if (!authorsData[articleAuthor]) {
      authorsData[articleAuthor] = 1;
    } else {
      authorsData[articleAuthor]++;
    }
  }

  const authorList = document.querySelector(optAuthorsListSelector);
  const authorParams = calculateAuthorParams(authorsData);
  let allAuthorsHTML = '';

  for (let author in authorsData) {
    const authorLinkHTML = '<li><a href="#author-' + author + '" class="' + calculateAuthorClass(authorsData[author], authorParams) + '">' + author + ' (' + authorsData[author] + ')</a></li>';
    allAuthorsHTML += authorLinkHTML;
  }

  authorList.innerHTML = allAuthorsHTML;
}

function addClickListenersToAuthors() {
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[data-author]');
  /* START LOOP: for each link */
  authorLinks.forEach(authorLink => {
    /* add authorClickHandler as an event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  /* END LOOP: for each link */
  });
}

function authorClickHandler(event) {
  /* prevent default action for this event */ 
  event.preventDefault();
  /* make a new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '');
  /* find all author links with class active */
  const activeAuthorLinks = document.querySelectorAll('a.active[data-author]');
  /* START LOOP: for each active author link */
  activeAuthorLinks.forEach(activeLink => {
    /* remove class active */
    activeLink.classList.remove('active');
  /* END LOOP: for each active author link */
  });
  
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll(`a[href="${href}"]`);
  /* START LOOP: for each found author link */
  authorLinks.forEach(authorLink => {
    /* add class active */
    authorLink.classList.add('active');
  /* END LOOP: for each found author link */
  /* execute function "generateTitleLinks" with article selector as an argument */
  generateTitleLinks('[data-author="' + author + '"]');
});
}
const authorList = document.querySelector('.authors');
authorList.innerHTML = '';
addClickListenersToAuthors();
generateAuthors();