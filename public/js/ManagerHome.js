console.log("document loaded");

$(document).ready(() => {
  $("#creatClass").click((e) => {
    e.preventDefault();

    var data = {};

    $("#topClassCreate")
      .serializeArray()
      .forEach((element) => {
        if (element.value) {
          data[element.name] = element.value;
        }
      });
    console.log(data);
    $.ajax({
      type: "POST",
      url: "/chatRoom/create",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        alert("Chat room created Succesfully");
      },
      error: function (e) {
        alert("Chat room name already taken");
        console.log(e);
      },
    });
  });

  $.ajax({
    type: "GET",
    url: "/manager/loadHome",
    success: function (data) {
      data.forEach((element) => {
        if (element.developerId) {
          $("#toAppend").prepend(`
            <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                            <span class="postUsername">
                                                ${element?.developerId?.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${element?.fileUpload?.filename}" alt="" />
                                    <span class="postText"> This is the description of a post dasifggfasdkjgfhaskjfha lkajsdhflkjhafg jhasdlkjfhaslkj </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/heart.png"
                                        alt=""
                    
                                    />
                                    <span class="postLikeCounter">2 people like this</span>
                                    </div>
                                    <div class="postBottomRight">
                                        <span class="postCommentText">9 comments</span>
                                    </div>
                                </div>`);
        } else {
          $("#toAppend").prepend(`
           <div class="postWrapper">
                                <div class="postTop">
                                    <div class="postTopLeft">
                                        <div class="postChatUsername">
                                            <span class="postChatroom">
                                            ${element?.name}
                                            </span>
                                            <span class="postUsername">
                                                ${element?.managerId.name}
                                            </span>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div class="postCenter">
                                    <img class="postImg" src="http://localhost:3000/images/${element?.fileUpload?.filename}" alt="" />
                                    <span class="postText"> This is the description of a post dasifggfasdkjgfhaskjfha lkajsdhflkjhafg jhasdlkjfhaslkj </span>
                                </div>
                                 <div class="postBottom">
                                    <div class="postBottomLeft">
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/like.png"
                                        alt=""
                            
                                    />
                                    <img
                                        class="likeIcon"
                                        src="http://localhost:3000/img/heart.png"
                                        alt=""
                    
                                    />
                                    <span class="postLikeCounter">2 people like this</span>
                                    </div>
                                    <div class="postBottomRight">
                                        <span class="postCommentText">9 comments</span>
                                    </div>
                                </div>`);
        }
      });
    },
    error: function () {
      alert("Error while loading profile");
    },
  });
});
