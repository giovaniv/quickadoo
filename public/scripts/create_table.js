$('#document').ready(function(e) {

  function createPoll(formData) {
    //toDO add class for title info
    let $article =$('<article>');
    let $title = $('<div>');
    //Add event title from DB
    let $eventTitle = $('<h1>').text(formData.events.title);
    //Need to check if this exists and Add or move on
    let $eventDesc = $('<h3>').text(formData.events.desciption);

    $title.append($eventTitle);
    $title.append($eventDesc);

    $article.append($title);

    //create user info
    let $user = $('<div>');
    let $userName = $('<p>').text(formData.users.first_name + ' ' + formData.users.last_name);
    let $timeCreated = $('<p>').text(formData.users.created_at);

    $user.append($userName);
    $user.append($timeCreated);

    $article.append($user);
    //loops over options from event and populates table
   let optionRows = createOptions();



    return $article;
  }

  function createOptions($options) {
    options.forEach(option => {
      let $option = $('<div>');
      let $optionName = $('<h3>').text(formData.options.name);
      let $checkbox = $('<input type="checkbox">');
      //if exists
      let $optionDesc = $('<p>').text(formData.option.description);
      //if exists
      let $start = $('<p>').text(formData.options.start_time);
      //if exists
      let $end = $('<p>').text(formData.options.end_time);

      $option.append($checkbox);
      $option.append($optionName);
      $option.append($optionDesc);
      $option.append($start);
      $option.append($end);

      $article.append(option);
    });
  }