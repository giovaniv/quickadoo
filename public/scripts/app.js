$(() => {
  const { activateCopyBtn, activateDeleteBtn, makeUrlCopyBtn } = activateBtns;
  const { selectFirstField, validateForm, submitEventForm } = formFunc;
  const { dtPickerConfig, activateCalendar } = makeCalendar;
  // change all icon cursors to pointer
  $('i.material-icons').css('cursor', 'pointer');

  // activate calendar
  activateCalendar();

  // activate copy and delete button for options
  activateCopyBtn(dtPickerConfig);
  activateDeleteBtn();

  // activate the url-copy button
  makeUrlCopyBtn();

  // auto focus input[name="first_name"]
  selectFirstField();

  // activate form validator
  validateForm();

  // submit event form
  submitEventForm();
  $('input[name="voter_email"]').blur(function () {
    console.log('entrou');
    let email = $(this).val();
    $.ajax('/voters', {
      method: 'POST',
      data: { 'email': email }
    }).done(function (resp) {
      let user = resp.attendee;
      let options = resp.options;
      $('input[name="voter_first_name"]').val(user.first_name);
      $('input[name="voter_last_name"]').val(user.last_name);
      $('input[type=checkbox]').each(function () {
        let chk_value = $(this).val();
        for (let i = 0; i < options.length; i++) {
          if (chk_value == options[i]) {
            $(this).attr('checked', true);
          }
        }
      });

      return;
    })
  });

});
