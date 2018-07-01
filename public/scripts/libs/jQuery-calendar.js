jQuery.datetimepicker.setLocale('en');

jQuery('#datetimepicker').datetimepicker({
  i18n:{
   en:{
    months:[
     'January','February','Mars','April',
     'May','Jun', 'July','August',
     'September','October','November','Deember',
    ],
    dayOfWeek:[
     "Su.", "Mo", "Tues", "Wed",
     "Thurs", "Fri", "Sat",
    ]
   }
  },
  timepicker:false,
  format:'d.m.Y'
 });