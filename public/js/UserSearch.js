$(document).ready(() => {
  $("#button-addon2").click((e) => {
    e.preventDefault();
    var query = $("#button-addon2").data("userid");
    var data = {
      name: $("#ClassName").val(),
    };

    $.ajax({
      type: "POST",
      url: "/search",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        $(".b").remove();
        var flag = 0;
        console.log(data);
        var buttonHtml;
        if (data.developer) {
          var students = Object.keys(data.developer);
          students.forEach((element) => {
            if (element == query) {
              return (flag = 1);
            }
          });
          if (flag == 1) {
            $("#append").append(`<div class="chatRoom" >
                    <div class="chatRoomLeft">
                        <span class="username">${data.name}</span>
                        <div ><span class="twitter-handle">${
                          data?.description
                        }</span></div>
                        <div class="follow">${
                          Object.keys(data.developer).length
                        } Following</div>
                    </div>
                        
                    <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${
                      data._id
                    }" >Unfollow</button>           
              </div>`);
          } else {
            $("#append").append(`<div class="chatRoom" >
                    <div class="chatRoomLeft">
                        <span class="username">${data.name}</span>
                        <div ><span class="twitter-handle">${
                          data?.description
                        }</span></div>
                        <div class="follow">${
                          Object.keys(data.developer).length
                        } Following</div>
                    </div>
                        
                    <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${
                      data._id
                    }" >Follow</button>           
              </div>`);
          }
        } else {
          $("#append").append(`<div class="chatRoom" >
                    <div class="chatRoomLeft">
                        <span class="username">${data.name}</span>
                        <div ><span class="twitter-handle">${data?.description}</span></div>
                        <div class="follow">${data.developerCount} Following</div>
                    </div>
                        
                    <button type="button" class="edit followClass" class="btn btn-primary" data-userid = "${data._id}" >Follow</button>           
              </div>`);
        }
      },
      error: function () {
        alert("No class found");
      },
    });
    $("#ClassName").val("").empty();
  });

  $("#append").on("click", "button", function (e) {
    var data = {
      id: $(this).data("userid"),
    };

    $.ajax({
      type: "POST",
      url: "/developer/follow",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data1) {
        if (data1 && data1.following) {
          var following = Object.keys(data1?.following);
          var flag = 0;
          following.forEach((element) => {
            if (element == data.id) {
              flag = 1;
              return;
            }
          });
          if (flag == 1) {
            $("button.followClass").html("Unfollow");
          } else {
            $("button.followClass").html("Follow");
          }
        } else {
          $("button.followClass").html("Follow");
        }
      },
      error: function () {
        alert("Error while login developer");
      },
    });
  });
});
