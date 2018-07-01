// construct the next option id. if the current option id is option-1, then the next id is option-2
const makeNextOptionId = $cloner => {
  const $currentIdNum = Number($cloner.attr('id').split('-')[1]);
  return `option-${$currentIdNum + 1}`;
};

// appends a clone of your selected option div to its parent div
const activateCopyBtn = () => {
  $('form .copy').on('click', function () {
    // parent option div
    const $optionSection = $('.option');
    // each option div (child)
    const $eachOption = $(this).parents().eq(3);
    // create a cloner
    const $cloner = $eachOption.clone(true, true);
    // assign your new id to the cloner and insert it
    $cloner.attr('id', makeNextOptionId($cloner));
    $cloner.insertAfter($optionSection);
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