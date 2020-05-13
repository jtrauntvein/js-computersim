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
 * @param {number=0} options.mi_index Specifies the index of control bus line that enables the memory address register to load
 * from the data bus.
 * 
 * @param {number=1} options.mo_index Specifies the index of the control bus line that enables the memory to output the currently
 * addressed cell to the data bus.
 */
function VirtualMemory({
   clock = null,
   data_bus = null,
   control_bus = null,
   width = 8,
   size = 256,
   mi_index = 0,
   mo_index = 1
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
   this.mo_index = mo_index;
   this.address_register = new VirtualRegister({
      clock: clock,
      data_bus: data_bus,
      control_bus: control_bus,
      size: width,
      read_enable_idx: mi_index
   });
   this.bus_mask = 1;
   for(let i = 0; i < width; ++i)
   {
      this.bus_mask <<= 1;
      this.bus_mask |= 1;
   }
   this.storage = new Array(size);
   for(let i = 0; i < size; ++i)
      this.storage[i] = 0;
   clock.add_rising_client(() => {
      if(control_bus.get(mo_index))
         bus.register = this.storage[this.address_register.register] & bus_mask;
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