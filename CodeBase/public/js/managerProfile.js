var currentUser = $('.username').data('username');
var userId = "";
var postId = "";
var username = "";
$(document).ready((e) => {
  $.ajax({
    type: "GET",
    url: "/manager/profile",
    success: function (data) {},
    error: function () {
      alert("Error while loading profile");
    },
  });

  $("#editProfile").click((e) => {
    e.preventDefault();

    var data = {};

    $("#editProfileForm")
      .serializeArray()
      .forEach((element) => {
        if (element.value) {
          data[element.name] = element.value;
        }
      });

    $.ajax({
      type: "PATCH",
      url: "/developer/manager/profile/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        window.location.href = data.redirect;
      },
      error: function () {
        alert("Error while updating developer");
      },
    });
  });

  $.ajax({
    type: "GET",
    url: "/manager/chatRoom/getDocument",
    success: function (data) {
      data.forEach((element) => {
        $("#toappend").append(`
             <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${
                                      element?.fileUpload?.filename
                                    }" alt="" />
                                    <span class="postText"> ${
                                      element?.description
                                    } </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                   
                                    <button class="invoke-like" data-userId="${
                                      element.managerId
                                    }" data-postId="${
          element?._id
        }" data-isManager="1" onclick="likePost(event)">
                                    <img
                                    data-userId="${
                                      element.managerId
                                    }" data-postId="${
          element?._id
        }" data-isManager="1"
                                    class="likeIcon"
                                    src="http://localhost:3000/img/${
                                      element.likedBy.indexOf(
                                        element.managerId
                                      ) >= 0
                                        ? "heart.png "
                                        : "heartless.png"
                                    } "
                                    alt=""
                        
                                    />
                                </button>
                                    <span class="postLikeCounter">${
                                      element.likeCount
                                    } like this</span>
                                    </div>
                                    <div class="postBottomRight" data-toggle="modal" data-target="#commentModal">
                                        <span class="postCommentText" data-userId="${
                                          element.managerId
                                        }" data-postId="${
          element?._id
        }" data-isManager="1" 
          data-username=${element.managerId}>
                                    Comments</span>
                                    </div>
                                    <div
                                      class="modal fade"
                                      id="commentModal"
                                      tabindex="-1"
                                      role="dialog"
                                      aria-labelledby="commentModalLabel"
                                      aria-hidden="true"
                              >
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Add Comment</h5>
                    <button
                    type="button"
                    class="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    >
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modalComment">
                    <form id="modalCommentForm" name="modalCommentForm" enctype="multipart/form-data">
                        <div class="modalCommentInput form-group">
                            <input  type="text" id="comment-content" name="comment" class="form-control" id="commentModalTextArea" rows="1" placeholder="Comment here" required='true'></input>
                        </div>
                        <button id="comment-post1" form="modalCommentPost" type="submit" class="commentPostButton " data-userId="${
                          element.managerId
                        }" data-postId="${
          element?._id
        }" data-isManager="1"  aria-hidden="true">Post Comment</button>
                    </form>
                </div>
                <hr class="commentHr">
                <div class="modalAllComments">
      
                </div>
            </div>
        </div>
    </div>
                                </div>
                                </div>`);
      });
    },
    error: function (e) {
      alert("somthing went wrong while loading document");
    },
  });
  $(".invoke-like").click((e) => {
    console.log("Button clicked 2", e);
  });

  $("#toappend").on("click", "#comment-post1", function (event) {
    event.preventDefault();
    let url = "/post/reply";
    let isManager = event.target.dataset.ismanager;
    currentUser = $('.username').data('username');
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
      username: currentUser,
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
        // window.location.href = data.redirect;
        getCommentData(userId, postId);
      },
      error: function (e) {
        console.log(e);
        alert("Error while login manager", e);
      },
    });
  });

  $("#toappend").on("click", ".postCommentText", function (event) {
    event.preventDefault();
    console.log("button clicked");
    userId = event.target.dataset.userid;
    postId = event.target.dataset.postid;
    username = currentUser;
    getCommentData(userId, postId);
  });
});

function likePost(e) {
  e.preventDefault();
  let userId = e.target.dataset.userid;
  let postId = e.target.dataset.postid;
  let isManager = e.target.dataset.ismanager;
  let url =
    isManager == "0"
      ? "/developer/post/likeDocument"
      : "/manager/post/likeDocument";
  var data = {
    UserId: userId,
    postId: postId,
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
      // window.location.href = data.redirect;
      console.log(data);
      if (!data.like) {
        // add image for non liked image
        document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML =
          "";
        document.querySelectorAll(`[data-postId="${postId}"]`)[0].innerHTML = `
            <img
            data-userId="${userId}" data-postId="${postId}" data-isManager="1"
                class="likeIcon invoke-like"
                src="http://localhost:3000/img/heartless.png"
                alt=""

            />`;
      } else {
        // add image for liked image
        document.querySelectorAll(
          `[data-postId="${data.like.postId}"]`
        )[0].innerHTML = "";
        document.querySelectorAll(
          `[data-postId="${data.like.postId}"]`
        )[0].innerHTML = `
            <img
            data-userId="${userId}" data-postId="${postId}" data-isManager="1"
                class="likeIcon invoke-like new"
                src="http://localhost:3000/img/heart.png"
                alt=""

            />
            `;
      }
    },
    error: function (e) {
      console.log(e);
      alert("Error while login manager", e);
    },
  });
}



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
      // window.location.href = data.redirect;
      $(".modalAllComments").empty();
      if (data.length > 0) {
        data.forEach((element) => {
          $(".modalAllComments").prepend(`                    
                <div class="modalCommentWrapper">
                <div class="modalCommentUsername">
                <span>Commented By: ${element.userName}</span>
            </div>
                <div class="modalCommentUsername">
                    <span>Comment: ${element.content}</span>
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
