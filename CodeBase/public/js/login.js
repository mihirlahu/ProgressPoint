$(document).ready(function () {
  $("#login-submit").click((e) => {
    e.preventDefault();
    var data = {};

    $("#loginForm")
      .serializeArray()
      .forEach((element) => {
        if (element.value) {
          data[element.name] = element.value;
        }
      });

    if (data.userType == "Manager") {
      $.ajax({
        type: "POST",
        url: "/login/manager",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
          window.location.href = data.redirect;
        },
        error: function () {
          alert("Error while login manager");
        },
      });
    } else {
      $.ajax({
        type: "POST",
        url: "/login/developer",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(data),
        dataType: "json",
        success: function (data) {
          window.location.href = data.redirect;
        },
        error: function () {
          alert("Error while login developer");
        },
      });
    }
  });
});

$("#register-submit").click((e) => {
  e.preventDefault();

  var data = {};

  $("#registerForm")
    .serializeArray()
    .forEach((element) => {
      if (element.value) {
        data[element.name] = element.value;
      }
    });
  if (data.userType == "Manager") {
    $.ajax({
      type: "POST",
      url: "/register/manager",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        window.location.href = data.redirect;
      },
      error: function () {
        alert("Error while creating manager");
      },
    });
  } else {
    $.ajax({
      type: "POST",
      url: "/register/developer",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify(data),
      dataType: "json",
      success: function (data) {
        window.location.href = data.redirect;
      },
      error: function () {
        alert("Error while creating developer");
      },
    });
  }
});
