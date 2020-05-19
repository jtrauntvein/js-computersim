/**
 * Defines an object that implements a counter that is controlled by a system clock,
 * a data bus, and control bus.  It will monitor three lines on the control bus that 
 * enable the counter, write the counter value to the data bus, or read the counter 
 * from the data bus.
 * 
 * @param {VirtualClock} options.clock Specifies the system clock.
 * 
 * @param {VirtualBus} options.data_bus Specifies the data bus for the system
 * 
 * @param {VirtualBus} options.control_bus Specifies the system control bus.
 * 
 * @param {number=8} options.counter_bits Specifies the number of bits used for this counter.
 * 
 * @param {number=0} options.read_data_index Specifies the number of the control
 * line that will control whether the counter will load its value from the data bus.
 * 
 * @param {number=1} options.write_data_index Specifies the number of the control 
 * line that will control whether the counter will write its data to the bus.
 * 
 * @param {number=2} options.count_enable_index Specifeis the number of the control
 * line that will control whether the counter is enabled.,
 */
function VirtualCounter({
   clock = null,
   data_bus = null,
   control_bus = null,
   counter_bits = 8,
   read_data_index = 0,
   write_data_index = 1,
   count_enable_index = 2
})
{
   if(!clock)
      throw Error("valid counter is required");
   this.clock = clock;
   if(!data_bus)
      throw Error("valid data bus is required");
   this.data_bus = data_bus;
   if(!control_bus)
      throw Error("control bus is required");
   this.control_bus = control_bus;
   this.counter_bits = counter_bits;
   this.read_data_index = read_data_index;
   this.write_data_index = write_data_index;
   this.count_enable_index = count_enable_index;
   this.counter_mask = 0;
   for(let i = 0; i < counter_bits; ++i)
      this.counter_mask |= (1 << i);
   this.counter = 0;
   clock.add_rising_client(() => {
      if(control_bus.get(read_data_index))
         this.counter = data_bus.register;
      if(control_bus.get(count_enable_index))
      {
         let result = { sum: 0, cout: 0 };
         for(let i = 0; i < counter_bits; ++i)
         {
            // eslint-disable-next-line no-undef
            result = VirtualFullAdder(result.cout, this.get(i), i === 0 ? 1 : 0);
            this.set(i, result.sum);
         }
      }
      if(control_bus.get(write_data_index))
         data_bus.register = this.counter;
   });
}


/** 
 * @return Returns the bit value at the specified index.
 * 
 * @param {number} idx Specifies the index.
 */
VirtualCounter.prototype.get = function(idx)
{
   return (this.counter & (1 << idx)) >> idx;
};


/**
 * @param {number} idx Specifies the index for the bit to be changed.
 * 
 * @param {number} bit Specifies the value for the bit to be changed.
 */
VirtualCounter.prototype.set = function(idx, bit)
{
   if(bit)
      this.counter |= ((1 << idx)) & this.counter_mask;
   else
      this.counter &= (~(1 << idx)) & this.counter_mask;
};
