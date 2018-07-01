$(() => {
  const { activateCopyBtn, activateDeleteBtn, makeUrlCopyBtn } = activateBtns;
  const { selectFirstField, validateForm, submitEventForm } = formFunc;
  // change all icon cursors to pointer
  $('i.material-icons').css('cursor', 'pointer');
  // activate copy and delete button for options
  activateCopyBtn();
  activateDeleteBtn();
  // activate the url-copy button
  makeUrlCopyBtn();


  // auto focus input[name="first_name"]
  selectFirstField();
  // activate form validator
  validateForm();
  // submit event form
  submitEventForm();

  const handler = function(){}
  $('input[name="name"]').blur(function () {
    // option section
    const $optionSection = $('.option');
    // each option div
    const $eachOption = $(this).parents().eq(2);
    // $eachOption.clone(true, true).appendTo($optionSection);
    // $eachOption.unbind();
  });


  $('input[name="voter_email"]').blur(function () {
    let email = $(this).val();
    let poll = $('input[name="poll_info"]').val();
    $.ajax('/atendees', {
      method: 'POST',
      data: { 'email':email, 'poll':poll }
    }).done(function(poll, atendee) {
      console.log(poll);
      console.log(atendee);
      console.log('redirect to the correct page');
      //$(document).load("poll.ejs", { poll, atendee });
    })
  });

});
