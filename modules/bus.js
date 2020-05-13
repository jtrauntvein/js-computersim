/**
 * Defines a simple object that implements a data bus.  Internally, the value of the 
 * bus is stored as a number and can be accessed by registers for reading or writing purposes.
 * Unlike registers, the bus stores its values passively.
 */
function VirtualBus()
{
   this.register = 0;
}


/**
 * @return {number} Returns 1 if the line for the specified index is set or zero if the bit is clear.  Returns
 * undefined if the index is out of bounds.
 * 
 * @param {number} index Specifies the line index for this bus.  This must be a value that is greater than or 
 * equal to zero and less than thirty two.
 */
VirtualBus.prototype.get = function(index)
{
   let rtn = undefined;
   if(index >= 0 && index < 32)
      rtn = (this.register & (1 << index)) >> index;
   return rtn;
}


/**
 * Sets the specified bit on the register to the specified value.
 * 
 * @param {number} bit_idx Specifies the index of the bit to set.
 * 
 * @param {number=-1} value Specifies the new value for the bit.  Will get toggled if less than zero.
 */
VirtualBus.prototype.set = function(bit_idx, value = -1)
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