// Ths script mus be ferrederd and only called after importer.js has been loaded

const loadedArticles = {};
// Accesing possibly loaded docuemnts
async function GetArticle(href) {
  return new Promise((resolve) => {
    if (href in loadedArticles) {
      resolve(loadedArticles[href]);
    } else {
      LoadHtml(path).then((html) => {
        loadedArticles[path] = html;
        resolve(html);
      });
    }
  });
}

// spcial classes
class PageDetails {
  constructor() {
    this.pageName;
    this.rootPath;
    this.mainId;
    this.navId;
  }
}
