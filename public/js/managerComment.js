var currentUser = $(".headerDiv").data("username");
var userId = "";
var postId = "";
var username = "";
$(document).ready(() => {
  $("#toAppend").on("click", "#comment-post1", function (event) {
    event.preventDefault();
    let url = "/post/reply";
    var data = {};
    $("#modalCommentForm")
      .serializeArray()
      .forEach((element) => {
        if (element.value) {
          data[element.name] = element.value;
        }
      });
    var data = {
      UserId: userId,
      content: data.comment,
      postId: postId,
      username: username,
    };
    $.ajax({
      type: "POST",
      url: url,
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        getCommentData(userId, postId);
      },
      error: function (e) {
        console.log(e);
        alert("Error while login manager", e);
      },
    });
  });

  $("#toAppend").on("click", ".postCommentText", function (event) {
    event.preventDefault();
    console.log("button clicked");
    userId = event.target.dataset.userid;
    postId = event.target.dataset.postid;
    username = currentUser;
    getCommentData(userId, postId);
  });
});

function getCommentData(UserId, postId) {
  var data = {
    UserId,
    postId,
  };
  let url = "/post/reply";
  $.ajax({
    type: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data,
    dataType: "json",
    success: function (data) {
      $(".modalAllComments").empty();
      if (data.length > 0) {
        data.forEach((element) => {
          $(".modalAllComments").prepend(`                    
                <div class="modalCommentWrapper">
                <div class="modalCommentUsername">
                <span>Commented By: ${element.userName}</span>
            </div>
                <div class="modalCommentContent">
                    <span>${element.content}</span>
                </div>
            </div>`);
        });
      }
      console.log(data);
    },
    error: function (e) {
      console.log(e);
      alert("Error while login manager", e);
    },
  });
}
