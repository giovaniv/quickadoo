const getNextIdNumber = ($parentDiv, delim) => {
  const idArray = [];
  $parentDiv.children().each(function () {
    if ($(this).attr('id') !== undefined) {
      const childrenId = Number($(this).attr('id').split(delim)[1]);
      idArray.push(childrenId);
    }
  })
  return Math.max(...idArray);
};

const cloneOptionDiv = $selectedBtn => {
  // parent option div
  const $optionSection = $('.option');
  // each option div (child)
  const $eachOption = $selectedBtn.parents().eq(3);
  // create a cloner
  const $cloner = $eachOption.clone(true, true);
  const nextOptionId = `option-${getNextIdNumber($optionSection, '-') + 1}`;
  // assign your new id to the cloner and insert it
  $cloner.attr('id', nextOptionId).insertAfter($eachOption);
};

// appends a clone of your selected option div to its parent div
const activateCopyBtn = datetimePickerConfig => {
  $('form .copy').on('click', function () {
    //  Reference to how to avoid cloned calendar to execute its original calendar
    // https://stackoverflow.com/questions/17331137/how-can-i-get-jquery-datepicker-to-work-on-cloned-rows

    // destroy datetimepicker (IMPORTANT! this must occur before inserting the clone)
    $('form .datetimepickers').datetimepicker('destroy');

    cloneOptionDiv($(this));

    // configure the datetimepicker again
    $('.datetimepickers').datetimepicker(datetimePickerConfig);
  });
};

// delete option div when you click on the trash icon
const activateDeleteBtn = () => {
  $('form .delete').on('click', function () {
    // do not allow users to remove option div if there is only one!
    const howManyLeft = $('.option').find('.delete').length;
    if (howManyLeft > 1) {
      const $currentOption = $(this).parents().eq(3);
      $currentOption.remove();
    }
  })
};

const copyTextToClipboard = $text => {
  const $temp = $("<input>");
  // create a temporary input field and put the copied text in it.
  // then execute document.execCommand() to save it to clipboard
  $("body").append($temp);
  $temp.val($text).select();
  document.execCommand("copy");
  $temp.remove();
};

// create a button that users can click on to copy poll URLs
const makeUrlCopyBtn = () => {
  $('article.nav-alert-wrapper .input-group').click(function () {
    const $parentDiv = $(this).parents().eq(1);
    // get the input value and copy it to clipboard
    const $textValue = $parentDiv.find('input[type="text"]').val();
    copyTextToClipboard($textValue);
  })
};

window.activateBtns = { activateCopyBtn, activateDeleteBtn, makeUrlCopyBtn }