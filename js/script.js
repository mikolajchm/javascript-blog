const optArticleSelector = '.post',
      optTitleSelector = '.post-title',
      optTitleListSelector = '.titles',
      optArticleTagsSelector = '.post-tags .list',
      optArticleAuthorSelector = '.post-author',
      optTagsListSelector = '.tags.list',
      optCloudClassCount = 5,
      optCloudClassPrefix = 'tag-size-',
      optAuthorsListSelector = '.authors';

function generateTitleLinks(customSelector = '') {
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

function calculateTagsParams(tags) {
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

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1);

  return optCloudClassPrefix + classNumber;
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find tags wrapper */
    const tagWrapper = article.querySelector(optArticleTagsSelector);
    /* make html variable with empty string */
    let html = '';
    /* get tags from data-tags attribute */
    const articleTags = article.getAttribute('data-tags');
    /* split tags into array */
    const articleTagsArray = articleTags.split(' ');
    /* START LOOP: for each tag */
    for (let tag of articleTagsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#tag-' + tag + '">' + tag + '</a></li>';
      /* add generated code to html variable */
      html += linkHTML;
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    /* insert HTML of all the links into the tags wrapper */
    if (tagWrapper) {
      tagWrapper.innerHTML += html;
    }
  }
  /* END LOOP: for every article: */
  /* [NEW] find list of tags in right column */
  const tagList = document.querySelector(optTagsListSelector);

  const tagsParams = calculateTagsParams(allTags);
  console.log('tagsParams:', tagsParams);

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

  /* add event listeners to tag links */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  for (let tagLink of tagLinks) {
    tagLink.addEventListener('click', tagClickHandler);
  }
}

generateTags();

function tagClickHandler(event) {
  /* prevent default action for this event */
  event.preventDefault();
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this;
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href');
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '');
  /* find all tag links with class active */
  const activeTagLinks = document.querySelectorAll('a.active[href^="#tag-"]');
  /* START LOOP: for each active tag link */
  for (let activeTagLink of activeTagLinks) {
    /* remove class active */
    activeTagLink.classList.remove('active');
  }
  /* END LOOP: for each active tag link */
  /* find all tag links with "href" attribute equal to the "href" constant */
  const tagLinks = document.querySelectorAll(`a[href="${href}"]`);
  /* START LOOP: for each found tag link */
  for (let tagLink of tagLinks) {
    /* add class active */
    tagLink.classList.add('active');
  }
  /* END LOOP: for each found tag link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]');
}

function calculateAuthorParams(authors) {
  let params = {
    max: 0,
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
  /* [NEW] create a new variable allAuthors with an empty object */
  let allAuthors = {};
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector);
  /* START LOOP: for every article: */
  for (let article of articles) {
    /* find authors wrapper */
    const authorWrapper = article.querySelector(optArticleAuthorSelector);
    /* make html variable with an empty string */
    let html = '';
    /* get authors from the data-author attribute */
    const articleAuthors = article.getAttribute('data-author');
    /* split authors into an array */
    const articleAuthorsArray = articleAuthors.split(' ');
    /* START LOOP: for each author */
    for (let author of articleAuthorsArray) {
      /* generate HTML of the link */
      const linkHTML = '<li><a href="#author-' + author + '" class="' + calculateAuthorClass(allAuthors[author], authorsParams) + '">' + author + ' (' + (allAuthors[author] ? allAuthors[author].count : 0) + ')</a></li>';
      /* add generated code to the html variable */
      html += linkHTML;
      /* [NEW] check if this author is NOT already in allAuthors */
      if (!allAuthors[author]) {
        /* [NEW] add author to allAuthors object */
        allAuthors[author] = { count: 1 };
      } else {
        allAuthors[author].count++;
      }
      /* END LOOP: for each author */
    }
    /* insert HTML of all the links into the authors wrapper */
    if (authorWrapper) {
      authorWrapper.innerHTML += html;
    }
    /* END LOOP: for every article: */
  }

  generateAuthors();

  
  /* [NEW] find list of authors in the right column */
  const authorsList = document.querySelector(optAuthorsListSelector);

  const authorsParams = calculateAuthorParams(allAuthors);
  console.log('authorsParams:', authorsParams);

  /* [NEW] create a variable for all links HTML code */
  let allAuthorsHTML = '';

  /* [NEW] START LOOP: for each author in allAuthors: */
  for (let author in allAuthors) {
    const authorLinkHTML = '<li><a href="#author-' + author + '" class="' + calculateAuthorClass(allAuthors[author].count, authorsParams) + '">' + author + ' (' + allAuthors[author].count + ')</a></li>';
    console.log('authorLinkHTML:', authorLinkHTML);
    /* [NEW] generate code of a link and add it to allAuthorsHTML */
    allAuthorsHTML += authorLinkHTML;
  }
  /* [NEW] END LOOP: for each author in allAuthors: */

  /*[NEW] add HTML from allAuthorsHTML to authorsList */
  authorsList.innerHTML = allAuthorsHTML;

  /* add event listeners to author links */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  for (let authorLink of authorLinks) {
    authorLink.addEventListener('click', authorClickHandler);
  }
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
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  /* START LOOP: for each active author link */
  for (let activeAuthorLink of activeAuthorLinks) {
    /* remove class active */
    activeAuthorLink.classList.remove('active');
  }
  /* END LOOP: for each active author link */
  /* find all author links with "href" attribute equal to the "href" constant */
  const authorLinks = document.querySelectorAll(`a[href="${href}"]`);
  /* START LOOP: for each found author link */
  for (let authorLink of authorLinks) {
    /* add class active */
    authorLink.classList.add('active');
  }
  /* END LOOP: for each found author link */
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]');
}

function addClickListenersToTags() {
  /* find all links to tags */
  const tagLinks = document.querySelectorAll('a[href^="#tag-"]');
  /* START LOOP: for each link */
  for (let tagLink of tagLinks) {
    /* add tagClickHandler as event listener for that link */
    tagLink.addEventListener('click', tagClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToTags();

function addClickListenersToAuthors() {
  /* find all links to authors */
  const authorLinks = document.querySelectorAll('a[href^="#author-"]');
  /* START LOOP: for each link */
  for (let authorLink of authorLinks) {
    /* add authorClickHandler as event listener for that link */
    authorLink.addEventListener('click', authorClickHandler);
  }
  /* END LOOP: for each link */
}

addClickListenersToAuthors();
