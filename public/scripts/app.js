// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     // console.log(users);
//     for(user of users) {
//       $("<div>").text(user.email + " " + user.email + " " + user.last_name).appendTo($("body"));
//     }
//   });
// });
$(document).ready(function(){
  console.log('1');
$('input[type="submit"]').click(function(e) {
  console.log("click");
  e.preventDefault();
  
  $(".right-icon").toggle();
  $(".left-icon").toggle();
  // $("form-control").attr('readonly');
  // $("form-control.options.col-6").attr('readonly');
  // $("form-control.col-6").attr('readonly');
})
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
