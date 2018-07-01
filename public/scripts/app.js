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
    $.ajax('/voters', {
      method: 'POST',
      data: { 'email':email }
    }).done(function(resp) {
      let user = resp.attendee;
      let options = resp.options;
      $('input[name="voter_first_name"]').val(user.first_name);
      $('input[name="voter_last_name"]').val(user.last_name);
      $('input[type=checkbox]').each(function() {
          let chk_value = $(this).val();
          for ( let i = 0; i < options.length; i++) {
            if (chk_value == options[i]) {
              $(this).attr('checked',true);
            }
          }
      });

      return;
    })
  });

});
