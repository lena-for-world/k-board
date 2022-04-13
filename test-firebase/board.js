function getArticles(articles, query) {
  let res = "";
  let ids = {},
    categories = {};
  let contentLimit = 5;
  let content;
  for (let i = 0; i < articles.length; i++) {
    content =
      articles[i].content.length > contentLimit ? articles[i].content.substr(0, 5) + "..." : articles[i].content;
    res += `<div class="col-12 col-sm-6 col-lg-4">
        <div class="card">
          <div class="card-body">
            <h2 class="card-title"><b>${articles[i].title}</b></h2>
            <h6 class="card-subtitle mb-2">${articles[i].author}</h6>
            <p class="card-text">${content}
            </p>
          </div>
        </div>
      </div>`;
    ids[i] = articles[i].id;
    categories[i] = articles[i].categoryId;
  }

  document.querySelector(".articles").innerHTML = res;
  addButtons(ids, categories, query);
}

function addButtons(ids, categories, query) {
  console.log(ids);
  let articleList = document.querySelectorAll(".articles .card-body");
  console.log(articleList);
  for (let i = 0; i < articleList.length; i++) {
    articleList[i].addEventListener("click", function () {
      location.href = "view.html?" + `${query}` + "/" + categories[i] + "/" + ids[i];
    });
  }
}
