const getNextIdNumber = ($parentDiv, delim) => {
  const idArray = [];
  $parentDiv.children().each(function (index) {
    const childrenId = Number($(this).attr('id').split(delim)[1]);
    idArray.push(childrenId);
  })
  return Math.max(...idArray);
};

// appends a clone of your selected option div to its parent div
const activateCopyBtn = datetimePickerConfig => {
  $('form .copy').on('click', function () {
    //  Reference to how to avoid cloned calendar to execute its original calendar
    // https://stackoverflow.com/questions/17331137/how-can-i-get-jquery-datepicker-to-work-on-cloned-rows

    // destroy datetimepicker (IMPORTANT! this must occur before inserting the clone)
    $('form .datetimepickers').datetimepicker('destroy');

    // parent option div
    const $optionSection = $('.option');
    // each option div (child)
    const $eachOption = $(this).parents().eq(3);
    // create a cloner
    const $cloner = $eachOption.clone(true, true);
    const nextOptionId = `option-${getNextIdNumber($optionSection, '-') + 1}`;
    // assign your new id to the cloner and insert it
    $cloner.attr('id', nextOptionId).insertAfter($eachOption);

    // configure the datetimepicker again
    $('.datetimepickers').datetimepicker(datetimePickerConfig);
  });
};

// delete option div when you click on the trash icon
const activateDeleteBtn = () => {
  $('form .delete').on('click', function () {
    const $currentOption = $(this).parents().eq(3);
    $currentOption.remove();
  })
};

// create a button that users can click on to copy poll URLs
const makeUrlCopyBtn = () => {
  $('article.nav-alert-wrapper .input-group').click(function () {
    const $parentDiv = $(this).parents().eq(1);
    // get the input value and copy it to clipboard
    const $value = $parentDiv.find('input[type="text"]').val();
    const $temp = $("<input>");
    // create a temporary input field and put the copied text in it.
    // then execute document.execCommand() to save it to clipboard
    $("body").append($temp);
    $temp.val($value).select();
    document.execCommand("copy");
    $temp.remove();
  })
};

window.activateBtns = {
  activateCopyBtn,
  activateDeleteBtn,
  makeUrlCopyBtn
}