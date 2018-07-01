$(() => {
  validateForm();

  activateBtns.activateCopyBtn();
  activateBtns.activateDeleteBtn();



  // let editable = false;
  // $('input[value="PREVIEW"]').click(function (e) {
  //   e.preventDefault();

  //   // remove all default icons
  //   $(".material-icons").toggle();
  //   // display checkbox
  //   $(".right-icon input").toggle();
  //   // display vote counter
  //   $("#counter").toggle();
  //   // display thumbs up icon
  //   $(".fas.fa-thumbs-up").toggle();

  //   $('input[value="SUBMIT"]').slideToggle("fast");
  //   if (editable === false) {
  //     $('.form-control').attr('readonly', true);
  //     editable = true;
  //   } else {
  //     $('.form-control').attr('readonly', false);
  //     editable = false;
  //   };
  // })

});
