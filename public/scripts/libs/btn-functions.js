const activateCopyBtn = () => {
  $('form .copy').on('click', function () {
    // option section
    const $optionSection = $('.option');
    // each option div
    const $eachOption = $(this).parents().eq(3);
    $eachOption.clone(true, true).appendTo($optionSection);
  })
};

const activateDeleteBtn = () => {
  $('form .delete').on('click', function () {
    const $currentOption = $(this).parents().eq(3);
    $currentOption.remove();
  })
};

window.activateBtns = {
  activateCopyBtn,
  activateDeleteBtn
}