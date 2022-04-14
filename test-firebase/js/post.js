class Posting {
  constructor(url, categoryId = null) {
    this.url = url;
    this.categoryId = categoryId;
  }
  moveTo() {}
  postToServer(data) {
    var self = this;
    var api = this.url;
    $(function () {
      $.ajax({
        url: `http://localhost:3000/${api}`,
        type: "POST",
        data: JSON.stringify(data),
        contentType: "application/json",
      }).done(function () {
        location.href = self.moveTo();
      });
    });
  }
}

class NoticePosting extends Posting {
  moveTo() {
    return "notice.html";
  }
}

class ExpertPosting extends Posting {
  constructor(url, categoryId) {
    super(url, categoryId);
  }
  moveTo() {
    return `expert-detail.html?${this.categoryId}`;
  }
}

class DirectPosting extends Posting {
  moveTo() {
    return "section.html";
  }
}
