$(document).ready(() => {
  $.ajax({
    type: "GET",
    url: "/developer/loadHome",
    success: function (data) {
      console.log(data);
      data.forEach((element) => {
        if (element.developerId) {
          $("#toAppend").prepend(`
              <div class="append-info">
              <div class="info-image">
              <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200" >
              </div>
              <div class ="info-data">
              <div class="data-name">Chat Room name : ${element?.name}</div>
              <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
              
              </div>
              <div class="data-name"> <b>Uploaded by</b> :${element?.developerId?.name} </div>
              </div>
              </div>
          <div class="border-bottom"></div>`);
        } else {
          $("#toAppend").prepend(`
              <div class="append-info">
              <div class="info-image">
              <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200"  >
              </div>
              <div class ="info-data">
              <div class="data-name">Chat Room name : ${element?.name}</div>
              <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
              </div>
              <div class="data-name"> <b>Uploaded by</b> :${element?.managerId.name} </div>
              </div>
              </div>
          <div class="border-bottom"></div>`);
        }
      });
    },
    error: function () {
      alert("Error while loading profile");
    },
  });
});
