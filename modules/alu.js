/* eslint-disable no-undef */
/**
 * Defines a module that implements a virtual ALU for the simulated computer.  This
 * ALU is constructed to read two input registers as well as a control register.
 * 
 * @param {VirtualClock} config.clock Specifies the system clock.
 * 
 * @param {VirtualBus} config.data_bus Specifies the data bus.
 * 
 * @param {VirtualBus} config.control_bus Specifies the control bus.
 * 
 * @param {number=8} config.bus_size Specifies the size of the data bus.
 * 
 * @param {number=0} config.ai_index Specifies the control bus line that will control whether
 * the A register is loaded from the data bus on the rising clock edge.
 * 
 * @param {number=1} config.bi_index Specifies the control bus line that will control whether the B 
 * register is loaded from the data bus on the rising clock edge.
 * 
 * @param {number=3} config.output_index Specifies the control line that will control whether the output
 * register will write to the data bus on the rising clock edge.
 * 
 * @param {number=4} config.op_index Specifies the control line that will control whether addition (0) will
 * be performed or subtraction(1).
 */
function VirtualALU({
   clock,
   data_bus,
   control_bus,
   bus_size = 8,
   ai_index = 0,
   bi_index = 1,
   output_index = 3,
   op_index = 4
})
{
   if(!clock)
      throw Error("clock must br specified");
   this.clock = clock;
   if(!data_bus)
      throw Error("data bus must be specified");
   this.data_bus = data_bus;
   if(!control_bus)
      throw Error("control bus must be specified");
   this.control_bus = control_bus;
   this.ai_index = ai_index;
   this.bi_index = bi_index;
   this.output_index = output_index;
   this.op_index = op_index;
   this.a = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: bus_size,
      read_enable_idx: ai_index
   });
   this.b = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: bus_size,
      read_enable_idx: bi_index
   });
   this.output = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: bus_size,
      write_enable_idx: output_index
   });
   clock.add_rising_client(() => {
      const do_subtract = control_bus.get(op_index);
      let last_add = { sum: 0, cout: 0 };
      this.output.register = 0;
      for(let i = 0; i < bus_size; ++i)
      {
         // we can use the XOR operation to convert the b register to twos complement and feed in the result
         // to the adder logic.
         const ai = this.a.get(i);
         const bi = this.b.get(i);
         last_add = VirtualFullAdder(last_add.cout, ai, VirtualXOR(bi, do_subtract));
         this.output.register |= (last_add.sum << i);

         // @todo: we need to update the flags register with the zero and carry values 
      }
   }); 
}