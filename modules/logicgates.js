/**
 * Defines a function that evaluates boolean AND function on two binary inputs.
 * We could use the built-in bitwise operations for JavaScript here but, since our
 * purpose is to simulate an digital circuit, we will use base principles and produce
 * our output from a truth table.
 * 
 * @param {number} a Specfies the first binary input.
 * 
 * @param {number} b Specifies the second binary input
 * 
 * @return {number} Returns the result of the binary operation.
 */
function VirtualAND(a, b)
{
   let rtn = 0;
   for(let i = 0; i < VirtualAND.truth_table.length; ++i)
   {
      const combo = VirtualAND.truth_table[i];
      if(combo[0] === a && combo[b] === b)
      {
         rtn = combo[2];
         break;
      }
   }
   return rtn;
}
VirtualAND.truth_table = [
   [ 0, 0, 0 ],
   [ 0, 1, 0 ],
   [ 1, 0, 0 ],
   [ 1, 1, 1 ]
];


/**
 * Defines a function that emulates a NAND gate (inverted AND)
 * 
 * @param {number} a Specifies the first input.
 * 
 * @param {number} b Specifies the second input.
 * 
 * @return {number} Returns the result of the operation.
 */
function VirtualNAND(a, b)
{
   let rtn = 0;
   for(let i = 0; i < VirtualNAND.truth_table.length; ++i)
   {
      let combo = VirtualNAND.truth_table[i];
      if(combo[0] === a && combo[1] === b)
      {
         rtn = combo[2];
         break;
      }
   }
   return rtn;
}
VirtualNAND.truth_table = [
   [ 0, 0, 1 ],
   [ 0, 1, 1 ],
   [ 1, 0, 1 ],
   [ 1, 1, 0 ]
];


/**
 * Defines a function that emulates the an OR gate.  As with the AND, we will use a truth table to
 * illustrate base principles even though JavaScript has a built-in OR operator.
 * 
 * @param {number} a Specifies the first input.
 * 
 * @param {number} b Specifies the second input.
 * 
 * @return {number} Returns the result of the OR operation.
 */
function VirtualOR(a, b)
{
   let rtn = 0;
   for(let i = 0; i < VirtualOR.truth_table.length; ++i)
   {
      const combo = VirtualOR.truth_table[i];
      if(combo[0] === a && combo[1] === b)
      {
         rtn = combo[2];
         break;
      }
   }
   return rtn;
}
VirtualOR.truth_table = [
   [ 0, 0, 0 ],
   [ 0, 1, 1 ],
   [ 1, 0, 1 ],
   [ 1, 1, 1 ]
];


/**
 * Defines a function that evaluates the NOR bitwise operator.
 * 
 * @param {number} a Specifies the first input.
 * 
 * @param {number} b Specifies the second input.
 * 
 * @return {number} Returns the result of the NOR operator.
 */
function VirtualNOR(a, b)
{
   let rtn = 0;
   for(let i = 0; i < VirtualNOR.truth_table.length; ++i)
   {
      let combo = VirtualNOR.truth_table[i];
      if(combo[0] === a && combo[1] === b)
      {
         rtn = combo[2];
         break;
      }
   }
   return rtn;
}
VirtualNOR.truth_table = [
   [ 0, 0, 1 ],
   [ 0, 1, 0 ],
   [ 1, 0, 0 ],
   [ 1, 1, 1 ]
];


/**
 * @return {number} Returns the result of the XOR binary operator.
 * 
 * @param {number} a Specifies the first input.
 * 
 * @param {number} b Specifies the second input
 */
function VirtualXOR(a, b)
{
   let rtn = 0;
   for(let i = 0; i < VirtualXOR.truth_table.length; ++i)
   {
      let combo = VirtualXOR.truth_table[i];
      if(combo[0] === a && combo[1] === b)
      {
         rtn = combo[2];
         break;
      }
   }
   return rtn;
}
VirtualXOR.truth_table = [
   [ 0, 0, 0 ],
   [ 0, 1, 1 ],
   [ 1, 0, 1 ],
   [ 1, 1, 0 ]
];


/**
 * @return {Object} Returns an object with a sum and cout properties that result from the full adder logic.
 * 
 * @param {number} a Specifies the first operand
 * 
 * @param {number} b Specifies the second operand.
 * 
 * @param {number} cin Specifies the carry input.
 */
function VirtualFullAdder(cin, a, b)
{
   let rtn = {
      sum: 0, cout: 0
   };
   for(let i = 0; i < VirtualFullAdder.truth_table.length; ++i)
   {
      const combo = VirtualFullAdder.truth_table[i];
      if(combo[0] === cin && combo[1] === a && combo[2] === b)
      {
         rtn.sum = combo[3];
         rtn.cout = combo[4];
         break;
      }
   }
   return rtn;
}
VirtualFullAdder.truth_table = [
   [ 0, 0, 0, 0, 0 ],
   [ 0, 0, 1, 1, 0 ],
   [ 0, 1, 0, 1, 0 ],
   [ 0, 1, 1, 0, 1 ],
   [ 1, 0, 0, 1, 0 ],
   [ 1, 0, 1, 0, 1 ],
   [ 1, 1, 0, 0, 1 ],
   [ 1, 1, 1, 1, 1]
];