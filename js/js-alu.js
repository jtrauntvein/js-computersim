/* eslint-disable no-undef */
/**
 * Specifies the CPU components for this project
 */

let clock;
let data_bus;
let control_bus;
let data_register;
let memory;
let alu;


const RI = 1;
const RO = 2;
const MR = 3;
const MW = 4;
const MAI = 5;
const ALU_AI = 6;
const ALU_BI = 7;
const ALU_SUB = 8;
const ALU_OE = 9;
const register_size = 8;


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
   
}


/**
 * Called to initialise the data register and data bus and to register 
 * handlers for the controls to display and manipulate the control and data bus.
 */
function initialise_register()
{
   const register_leds = $(".register-led");
   const data_bus_leds = $(".data-bus-led");
   const data_bus_value = $("#data-bus-value");
   const control_ro_led = $("#control-RO .led");
   const control_ri_led = $("#control-RI .led");

   data_bus = new VirtualBus();
   control_bus = new VirtualBus();
   data_register = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: register_size,
      read_enable_idx: RI,
      write_enable_idx: RO
   });

   // we will display on the falling clock edge since the register values are always set on the rising edge.
   let editing_bus = false;
   clock.add_falling_client(() => {
      for(let i = 0; i < data_register.size; ++i)
      {
         if(data_register.get(data_register.size - i - 1))
            $(register_leds[i]).addClass("led-on");
         else
            $(register_leds[i]).removeClass("led-on");
      }
   });
   clock.add_rising_client(() => {
      if(!editing_bus)
         data_bus_value.val(data_bus.register.toString(16));
      if(control_bus.get(RO))
         control_ro_led.addClass("led-on");
      else 
         control_ro_led.removeClass("led-on");
      if(control_bus.get(RI))
         control_ri_led.addClass("led-on");
      else
         control_ri_led.removeClass("led-on");
      for(let i = 0; i < data_register.size; ++i)
      {
         if(data_bus.get(data_register.size - i - 1))
            $(data_bus_leds[i]).addClass("led-on");
         else
            $(data_bus_leds[i]).removeClass("led-on");
      }
   });
   data_bus_value.on("input", () => {
      editing_bus = true;
   });
   data_bus_value.change(() => {
      editing_bus = false;
      data_bus.register = Number.parseInt(data_bus_value.val(), 16);
   })
   $("#control-RO").click(() => {
      control_bus.set(RO);
      control_ro_led.toggleClass("led-on");
   });
   $("#control-RI").click(() => {
      control_bus.set(RI);
      control_ri_led.toggleClass("led-on");
   })
}


/**
 * Called to set up the memory module in the document.
 */
function initialise_memory()
{
   // initialise the memory module.
   const address_leds = $(".mem-address-led");
   const output_leds = $(".mem-output-led");
   const mai_button = $("#control-MAI");
   const mr_button = $("#control-MR");
   const mw_button = $("#control-MW");

   memory = new VirtualMemory({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      mr_index: MR,
      mw_index: MW,
      mai_index: MAI
   });
   clock.add_rising_client(() => {
      const address = memory.address_register;
      for(let i = 0; i < address.size; ++i)
      {
         if(address.get(address.size - i - 1))
            $(address_leds[i]).addClass("led-on");
         else
            $(address_leds[i]).removeClass("led-on");
      }
      for(let i = 0; i < memory.width; ++i)
      {
         if(memory.get(memory.width - i - 1))
            $(output_leds[i]).addClass("led-on");
         else
            $(output_leds[i]).removeClass("led-on");
      }
   });
   mai_button.click(() => {
      control_bus.set(MAI);
      mai_button.find(".led").toggleClass("led-on");
   })
   mr_button.click(() => {
      control_bus.set(MR);
      mr_button.find(".led").toggleClass("led-on");
   });
   mw_button.click(() => {
      control_bus.set(MW);
      mw_button.find(".led").toggleClass("led-on");
   });
}


/**
 * Called to initialise the ALU component, handle its events, and update its UI components
 */
function initialise_alu()
{
   const a_register_leds = $(".alu-a-led");
   const b_register_leds = $(".alu-b-led");
   const output_register_leds = $(".alu-out-led");
   const ai_btn = $("#control-ALU-AI");
   const bi_btn = $("#control-ALU-BI");
   const sub_btn = $("#control-ALU-SUB");
   const oe_btn = $("#control-ALU-OE");

   alu = new VirtualALU({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      ai_index: ALU_AI,
      bi_index: ALU_BI,
      output_index: ALU_OE,
      op_index: ALU_SUB
   });
   clock.add_rising_client(() => {
      for(let i = 0; i < register_size; ++i)
      {
         if(alu.a.get(register_size - i - 1))
            $(a_register_leds[i]).addClass("led-on");
         else  
            $(a_register_leds[i]).removeClass("led-on");
         if(alu.b.get(register_size - i - 1))
            $(b_register_leds[i]).addClass("led-on");
         else
            $(b_register_leds[i]).removeClass("led-on");
         if(alu.output.get(register_size - i - 1))
            $(output_register_leds[i]).addClass("led-on");
         else  
            $(output_register_leds[i]).removeClass("led-on");
      }
   });
   ai_btn.click(() => {
      control_bus.set(ALU_AI);
      ai_btn.find(".led").toggleClass("led-on");
   });
   bi_btn.click(() => {
      control_bus.set(ALU_BI);
      bi_btn.find(".led").toggleClass("led-on");
   });
   sub_btn.click(() => {
      control_bus.set(ALU_SUB);
      sub_btn.find(".led").toggleClass("led-on");
   });
   oe_btn.click(() => {
      control_bus.set(ALU_OE);
      oe_btn.find(".led").toggleClass("led-on");
   });
}


/**
 * Called to initialise the controls on the document.
 */
function initialise()
{
   initialise_clock();
   initialise_register();
   initialise_memory();
   initialise_alu();
}


$(document).ready(() => {
   initialise();
});
