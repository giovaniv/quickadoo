// auto select the first field of the event form
const selectFirstField = () => $('input[name="first_name"]').select();

// Example starter JavaScript for disabling form submissions if there are invalid fields
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

// submit event form
const submitEventForm = () => {
  $('#event-form').on('submit', function (event) {
    event.preventDefault();
    const formFields = $(this).serializeArray();

    function objectifyForm(formArray) {//serialize data function
      const optionFields = ['name', 'start_time', 'end_time', 'note'];
      var returnArray = {};
      let optionNum = 0;

      for (let i = 0; i < formArray.length; i++) {
        const name = formArray[i].name;
        const value = formArray[i].value;

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

    const formJSON = JSON.stringify(objectifyForm(formFields));

    $.ajax({
      url: '/events',
      method: 'POST',
      data: formJSON,
      dataType: 'json',
      success: urls => {
        window.location = `${window.location.href}/${urls.admin_url}`;
      },
      error: {

      }
    })
  })
};

window.formFunc = {
  selectFirstField,
  validateForm,
  submitEventForm
};