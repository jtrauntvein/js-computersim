/* eslint-disable no-undef */


/**
 * Specifies the clock that will be used to time all operations within the virtual CPU.
 */
let clock = null;

/**
 * Called to initialise the clock, register handlers for clock controls, and display the clock state.
 */
function initialise_clock()
{
   const led = $("#clock-led");
   const clock_btn = $("#clock-btn");
   const clock_btns = $("[name=clock-options]");
   const interval_input = $("#clock-interval");

   clock = new VirtualClock(false, 1000);
   clock.add_rising_client(() => {
      led.addClass("led-on");
   });
   clock.add_falling_client(() => {
      led.removeClass("led-on");
   });
   clock_btn.click(() => {
      $("#clock-manual").prop("checked", true);
      clock.cycle();
   });
   clock_btns.change(function(event) {
      if($(event.target).val() == "auto")
         clock.start();
      else
         clock.stop();
   });
   interval_input.on("input", () => { clock.stop(); });
   interval_input.change(() => {
      const interval = Number.parseInt(interval_input.val());
      clock.set_interval(interval);
      clock.start();
   })
   clock.start();
}


/**
 * Called to initialise the controls on the document.
 */
function initialise()
{
   initialise_clock();
}


$(document).ready(() => {
   initialise();
});
