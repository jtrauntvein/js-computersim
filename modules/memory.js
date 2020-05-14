/* eslint-disable no-undef */
/**
 * Defines an object that represents memory storage for the virtual CPU.
 * 
 * @param {VirtualClock} options.clock Specifies the system clock.
 * 
 * @param {VirtualBus} options.data_bus Specifies the system bus.
 * 
 * @param {VirtualBus} options.control_bus Specifies the control lines bus.
 * 
 * 
 * @param {number=8} options.width Specifies the width of an address cell.  Must be greater than zero and less than or equal to 32
 * 
 * @param {number=256} options.size Specifies the number of cells in this memory.
 * 
 * @param {number=0} options.mai_index Specifies the index of control bus line that enables the memory address register to load
 * from the data bus.
 * 
 * @param {number=1} options.mw_index Specifies the index of the control bus line that enables the memory to output the currently
 * addressed cell to the data bus.
 * 
 * @param {number=2} options.mr_index Specifies the index of the control bus line that enables the memory to read the value on the 
 * data bus into the currently addressed cell.
 */
function VirtualMemory({
   clock = null,
   data_bus = null,
   control_bus = null,
   width = 8,
   size = 256,
   mai_index = 0,
   mw_index = 1,
   mr_index = 2
})
{
   if(!clock)
      throw Error("system clock must be provided");
   if(!data_bus) 
      throw Error("data bus must be specified");
   if(!control_bus)
      throw Error("control bus must be specified");
   this.clock = clock;
   this.data_bus = data_bus;
   this.control_bus = control_bus;
   this.mr_index = mr_index;
   this.mw_index = mw_index;
   this.mai_index = mai_index;
   this.width = width;
   this.address_register = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: width,
      read_enable_idx: mai_index
   });
   this.bus_mask = 0;
   for(let i = 0; i < width; ++i)
      this.bus_mask |= (1 << i);
   this.storage = new Array(size);
   for(let i = 0; i < size; ++i)
      this.storage[i] = 0;
   clock.add_rising_client(() => {
      const address = this.address_register.register;
      if(control_bus.get(mr_index))
         this.data_bus.register = this.storage[address] & this.bus_mask;
      if(control_bus.get(mw_index))
         this.storage[address] = this.data_bus.register & this.bus_mask;
   });
}


/**
 * @return Returns the bit value of the currently addressed cell for the specified bit index.
 * 
 * @param {number} bit_idx Specifies the bit index for the cell to return.
 */
VirtualMemory.prototype.get = function(bit_idx)
{
   const cell = this.storage[this.address_register.register];
   return (cell & (1 << bit_idx)) >> bit_idx;
};