const activateCopyBtn = () => {
  $('form .copy').on('click', function () {
    // option section
    const $optionSection = $('.option');
    // each option div
    const $eachOption = $(this).parents().eq(3);
    const $cloner = $eachOption.clone(true, true);
    const $currentIdNum = Number($cloner.attr('id').split('-')[1]);
    const $nextId = `option-${$currentIdNum + 1}`;
    $cloner.attr('id', $nextId);
    $cloner.insertAfter($optionSection);
  });
};

const activateDeleteBtn = () => {
  $('form .delete').on('click', function () {
    const $currentOption = $(this).parents().eq(3);
    $currentOption.remove();
  })
};

const makeUrlCopyBtn = () => {
  $('article.nav-alert-wrapper .input-group').click(function () {
    const $parentDiv = $(this).parents().eq(1);
    // get the input value and copy it to clipboard
    const $value = $parentDiv.find('input[type="text"]').val();
    const $temp = $("<input>");
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