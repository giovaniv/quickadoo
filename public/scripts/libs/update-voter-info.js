

const displayVoterChoices = response => {
  const { user, options } = response;
  const { first_name, last_name } = user;
  // update the voter's first & last name input fields
  $('input[name="voter_first_name"]').val(first_name);
  $('input[name="voter_last_name"]').val(last_name);
  // also update voter's choice(s)
  $('input[type=checkbox]').each(function () {
    for (let i = 0; i < options.length; i++) {
      if ($(this).val() == options[i])
        $(this).attr('checked', true);
    }
  });
};

const updateVoterInfo = () => {
  // when voter email's filled, execute the function below
  $('input[name="voter_email"]').blur(function () {
    $.ajax('/voters', {
      method: 'POST',
      data: { email: $(this).val() }
    }).done(res => displayVoterChoices(res))
  });
};

window.updateVoterInfo = updateVoterInfo;