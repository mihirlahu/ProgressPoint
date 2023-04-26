$(document).ready(() => {
  $("#button-addon2").click((e) => {
    e.preventDefault();
    var query = $("#button-addon2").data("userid");
    var data = {
      name: $("#ClassName").val(),
    };
    $.ajax({
      type: "POST",
      url: "/manager/search",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        var element = data;
        $("div#append").append(`
                  <div class = "chatRoom">
                    <div class="chatRoomWrapper">
                        <div class="chatRoomTop">
                            <div class = "classroom-title">
                                <h1>
                                ${element.name}
                                </h1>
                            </div>
                            <div class = "classroom-description">
                                <h5><b>Description :</b> ${element.description}</h5>
                            </div>  
                        </div>

                        <hr class="chatRoomHr">

                        <div class="chatRoomLeft"> 
                            <div class = "classroom-owner">
                                <div class = "classroom-owner-details">
                                    <div class = "classroom-owner-details-name">
                                    <h5><b>Owners name :</b> ${element.owner.name}</h5>
                                    </div>
                                    <div class = "classroom-owner-details-email">
                                    <h5><b>Owners Email :</b> ${element.owner.email}</h5>
                                    </div>
                                    <div class = "classroom-owner-details-age">
                                    <h5><b>Owners Age :</b> ${element.owner.age}</h5>
                                    </div>
                                </div>
                                <div class = " classroom-details">
                                    <div class = " classroom-details-studentsCount">
                                    <h5><b>Team members :</b> ${element.developerCount}</h5>
                                    </div>
                                    <div class = " classroom-details-ceatedat">
                                    <h5><b>Created at :</b> ${element.createdAt}</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`);
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
        var following = Object.keys(data1.following);
        var flag = 0;
        following.forEach((element) => {
          if (element == data.id) {
            flag = 1;
            return;
          }
        });
        if (flag == 1) {
          $("button.followClass").html("UnFollow");
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
