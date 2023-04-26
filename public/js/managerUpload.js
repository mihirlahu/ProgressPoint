const socket = io()
$(document).ready(() => {
    $('#side-tweet').click((e) => {
        e.preventDefault()
        var data = {}
        $('#modalCreateUpload').serializeArray().forEach((element) => {
            if (element.value) {
                data[element.name] = element.value;
            }
        });
        var img = $('#side-tweet-file');
        data.fileUpload = img[0].files[0]
        var reqObj = new FormData();
        reqObj.append('name', data.name);
        reqObj.append('description', data.description);
        reqObj.append('fileUpload', data.fileUpload);
        $.ajax({
            type: 'POST',
            url: '/manager/chatRoom/uploadDocument',
            data: reqObj,
            processData: false,
            contentType: false,
            success: function(data) {
                socket.emit('Uploaded', data)
                alert('File uploaded Succesfully')
            },
            error: function(e) {
                alert('somthing went wrong while uploding document')
            }
        })
    })
})


socket.on("sending data", (data) => {
    $.ajax({
        type: 'GET',
        url: '/manager/loadHome',
        success: function(data) {
            $('.append-info').remove()

            data.forEach(element => {

                if (element.developerId) {
                    $('#toAppend').prepend(`
            <div class="append-info">
            <div class="info-image">
            <img src="http://localhost:3000/images/${element?.fileUpload?.filename}"  width="200" height="200" >
            </div>
            <div class ="info-data">
            <div class="data-name">Chat Room name : ${element?.name}</div>
            <div class="data-description"> <b>Description for the document</b> : <br>${element?.description}
            
            </div>
            <div class="data-name"> <b>Uploaded by</b> :${element?.developerId.name} </div>
            </div>
            </div>
        <div class="border-bottom"></div>`);
                } else {
                    $('#toAppend').prepend(`
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
        error: function() {
            alert('Error while loading profile')
        }
    })
})