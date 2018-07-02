const displayVoterChoices = (response, $userEmail) => {
  const { user, options } = response;
  const { first_name, last_name } = user;
  // update the voter's first & last name input fields
  $('input[name="voter_first_name"]').val(first_name);
  $('input[name="voter_last_name"]').val(last_name);
  // also update voter's choice(s)
  $('input[type=checkbox]').each(function () {
    for (let i = 0; i < options.length; i++) {
      if ($userEmail == options[i])
        $userEmail.attr('checked', true);
    }
  });
};

const updateVoterInfo = () => {
  // when voter email's filled, execute the function below
  $('input[name="voter_email"]').blur(function () {
    const email = $(this).val();
    $.ajax('/voters', {
      method: 'POST',
      data: { email }
    }).done(res => displayVoterChoices(res, $email))
  });
};

window.updateVoterInfo = updateVoterInfo;