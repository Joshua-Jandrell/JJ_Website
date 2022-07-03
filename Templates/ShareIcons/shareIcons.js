const mainShareLink =
  "mailto:?subject=I%20found%20an%20interesting%20article%20I%20though%20you%20may%20enjoy.%20&body=";
const facebookStart = "https://www.facebook.com/sharer/sharer.php?u=";

const linkednStart = "https://www.linkedin.com/shareArticle?mini=true&url=";
const linkedinEnd =
  "&title=I%20found%20and%20interesting%20article&summary=&source=";
const twitterStart = "https://twitter.com/intent/tweet?text=";

function DoTwitterShare() {
  GoToHref(twitterStart + GetDocHref());
}
function DoFackbookShare() {
  GoToHref(facebookStart + GetDocHref());
}
function DoLinkedinShare() {
  GoToHref(linkednStart + GetDocHref() + linkedinEnd);
}
function DoMailShare() {
  GoToHref(mainShareLink + GetDocHref());
}

function GetDocHref() {
  return window.location.href;
}
function GoToHref(href) {
  window.open(href);
}
