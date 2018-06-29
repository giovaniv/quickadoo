$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    // console.log(users);
    for(user of users) {
      $("<div>").text(user.email + " " + user.email + " " + user.last_name).appendTo($("body"));
    }
  });

  // $.ajax({
  //   method: "GET",
  //   url: "/api/events"
  // }).done((events) => {
  //   // console.log(users);
  //   // for(event of events) {
  //     $("<div>").text(event.title).appendTo($("body"));
  //   // }
  // });

});
//   $.ajax({
//     method: "GET",
//     url: "/api/events"
//   }).done((events) => {
//     for(event of events) {
//       $("<div>").text(event.title).appendTo($("body"));
//     }
//   });;
//   $.ajax({
//     method: "GET",
//     url: "/api/options"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });
