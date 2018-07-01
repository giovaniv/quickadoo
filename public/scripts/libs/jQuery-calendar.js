const dtPickerConfig = {
  minDate: 0,
  todayButton: true,
  format: 'D, M j, Y g:i A T',
  step: 15
};

const activateCalendar = () => {
  $('form .datetimepickers').datetimepicker(dtPickerConfig);
  $('input.datetimepickers').on('click', function(){
    $(this).datetimepicker(dtPickerConfig);
  })
};

window.makeCalendar = {
  dtPickerConfig,
  activateCalendar
};