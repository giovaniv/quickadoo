$(() => {
  const { activateCopyBtn, activateDeleteBtn, makeUrlCopyBtn } = activateBtns;
  const { updateVoterInfo, selectFirstField, validateForm, submitEventForm } = formFunc;
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

  // when voter email's filled, execute the function below
  updateVoterInfo();
});
