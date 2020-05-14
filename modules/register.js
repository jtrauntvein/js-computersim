/**
 * Defines an object that holds one data register with clock and interactions with the data bus and the 
 * controls bus.  
 * 
 * @param {Object} options.data_bus Specifies the data bus object with which this register will read or write.  
 * 
 * @param {Object} options.clock Specifies the clock that this register will watch.  If the write enable line or the read enable
 * line on the control bus is enabled when the clock transistions from low to high, this register will read or write its value to the 
 * data bus.
 * 
 * @param {Object} options.control_bus Specifies the control lines bus that will contain the read and write enable lines for this register.
 * 
 * @param {number=8} options.size Specifies the number of bits used for this register.  If not specified, it will default to
 * a value of 8 bits.
 * 
 * @param {number=-1} options.read_enable_idx Specifies the index of the read enable line for this register on the control 
 * bus.  If not specified, it will default to -1 indicating that this is a write-only register.
 * 
 * @param {number=-1} options.write_enable_idx Specifies the index of the write enable line for this register on the control
 * bus.  If not specified, it will default to -1 indicating that this is a read-only register.
 */
function VirtualRegister({
   clock = null,
   data_bus = null,
   control_bus = null,
   size = 8,
   read_enable_idx = -1,
   write_enable_idx = -1
})
{
   if(size > 32)
      size = 32;
   if(data_bus === null)
      throw Error("data bus is required");
   if(control_bus === null)
      throw Error("control bus is required");
   if(clock === null)
      throw Error("clock is required");
   this.clock = clock;
   this.data_bus = data_bus;
   this.control_bus = control_bus;
   this.size = size,
   this.read_enable_idx = read_enable_idx;
   this.write_enable_idx = write_enable_idx;
   this.bus_mask = 0;
   for(let i = 0; i < size; ++i)
      this.bus_mask |= (1 << i);
   this.register = 0; // we will use a number for the 
   clock.add_rising_client(() => {
      if(write_enable_idx >= 0 && control_bus.get(write_enable_idx))
         this.do_write();
      if(read_enable_idx >= 0 && control_bus.get(read_enable_idx))
         this.do_read();
   });
}


/**
 * Implements the method to write this value to the data bus.
 */
VirtualRegister.prototype.do_write = function()
{
   this.data_bus.register = this.register;
};


/**
 * Implements the method to read this value from the data bus.  This method can be overwritten 
 * by a derived class.  For instance, an address register, which might be bigger than the data bus, 
 * might shift the register contents before reading the next value from the bus.
 */
VirtualRegister.prototype.do_read = function()
{
   this.register = this.data_bus.register & this.bus_mask;
};


/**
 * @return {number} Returns one if the specified bit for this register is set or zero if the specified bit is cleared.
 * 
 * @param {number} bit_idx Specifies the bit index.  This must be a value between zero and the size
 * with which this register was constructed.  If this is out of bounds, the return value will be
 * undefined.
 */
VirtualRegister.prototype.get = function(bit_idx)
{
   let rtn = undefined;
   if(bit_idx >= 0 && bit_idx < this.size)
      rtn = (this.register & (1 << bit_idx)) >> bit_idx; 
   return rtn;
};


/**
 * Sets the specified bit on the register to the specified value.
 * 
 * @param {number} bit_idx Specifies the index of the bit to set.
 * 
 * @param {number=-1} value Specifies the new value for the bit.  Will get toggled if less than zero.
 */
VirtualRegister.prototype.set = function(bit_idx, value = -1)
{
   let bit_val;
   if(value > 0)
      bit_val = 1;
   else if(value === 0)
      bit_val = 0;
   else
      bit_val = ~((this.register & (1 << bit_idx)) >> bit_idx) & 0x01;
   if(bit_val)
      this.register |= (bit_val << bit_idx);
   else
      this.register &= ~(1 << bit_idx);
};