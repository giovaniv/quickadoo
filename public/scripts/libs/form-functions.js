// auto select the first field of the event form
const selectFirstField = () => $('input[name="first_name"]').select();

// Example starter JavaScript for disabling form submissions if there are invalid fields
// reference: Bootstrap
const validateForm = () => {
  'use strict';
  window.addEventListener('load', function () {
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function (form) {
      form.addEventListener('submit', function (event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  }, false);
};

// when raw form data is returned, all option fields have the same name.
// in order to distinguish each option fields (e.g. 1st option, 2nd option, etc)
// add a number at the end of the fields. For instance, option-1's fields are called
// name-1, start_time-1, end_time-1, and note-1 as opposed to *-2
function objectifyForm(formArray) {
  const optionFields = ['name', 'start_time', 'end_time', 'note'];
  var returnArray = {};
  let optionNum = 0;

  for (let i = 0; i < formArray.length; i++) {
    const { name, value } = formArray[i];
    const optionIndex = optionFields.indexOf(name);
    if (optionIndex !== -1) {
      if (optionIndex === 0) optionNum++;
      returnArray[`${name}-${optionNum}`] = value;
    } else {
      returnArray[name] = value;
    }
  }
  return returnArray;
}

// submit event form
const submitEventForm = () => {
  $('#event-form').on('submit', function (event) {
    event.preventDefault();
    // serialise the form data
    const formFields = $(this).serializeArray();
    const formJSON = JSON.stringify(objectifyForm(formFields));

    $.ajax({
      url: '/events',
      method: 'POST',
      data: formJSON,
      dataType: 'json',
      success: urls => {
        window.location = `${window.location.href}/${urls.admin_url}`;
      }
    })

  })
};

window.formFunc = { selectFirstField, validateForm, submitEventForm };