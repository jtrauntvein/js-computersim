/**
 * Defines an object that provides the system clock for the virtual CPU.  It provides methods
 * that allow the application to set the clock to manually timed or manually stepped.  
 * It also allows the application to register listening functions that will receive notifications 
 * on clock transition events (low to high or high to low).  Finally, it provides the application
 * with an interface that allows the clock interval to be adjusted within a range of 2 msec up to 5 seconds.
 * 
 * @param {boolean=true} auto_clock Set to true if the clock should auto-time.
 * 
 * @param {number=1000} interval Specifies the default interval in seconds.
 */
function VirtualClock(auto_clock = true, interval = 1000)
{
   if(interval < 2)
      interval = 2;
   if(interval > 5000)
      interval = 5000;
   this.auto_clock = auto_clock;
   this.interval = interval;
   this.rising_edge_clients = [];
   this.falling_edge_clients = [];
   this.value = false;
   this.timer = null;
   this.cycle_timer = null;
   if(this.auto_clock)
      this.start();
}


/**
 * Starts the interval timer for the automatic clock and sets the mode into auto.
 */
VirtualClock.prototype.start = function()
{
   this.auto_clock = true;
   if(this.timer)
      clearInterval(this.timer);
   this.timer = setInterval(() => { this.step(); }, this.interval / 2);
};


/**
 * Stops the interval timer for the automatic clock and turns the clock into single-step.
 */
VirtualClock.prototype.stop = function()
{
   this.auto_clock = false;
   if(this.timer)
   {
      clearInterval(this.timer);
      this.timer = null;
   }
};


/**
 * Steps the clock into the next state (low-to-high or high-to-low)  This represents 1/2 of the clock cycle.
 */
VirtualClock.prototype.step = function()
{
   const current = this.value;
   this.value = !this.value;
   if(current)
   {
      this.falling_edge_clients.forEach((client) => { client(); });
   }
   else
   {
      this.rising_edge_clients.forEach((client) => { client(); });
   }
};


/**
 * @return Returns a promise that when accepted, will have stepped the clock through one complete cycle
 * from its current state.  If the clock is currently running in auto mode, it will transistion to manual
 * mode.  The auto mode can be restarted at any time after this by calling start().
 */
VirtualClock.prototype.cycle = async function()
{
   // we will ignore if the timer is already waiting for a manual cycle.
   if(this.cycle_timer === null)
   {
      this.stop();
      return new Promise((accept) => {
         this.step();
         this.cycle_timer = setTimeout(() => { 
            this.step();
            this.cycle_timer = null;
            accept();
         }, this.interval / 2);
      });
   }
};


/**
 * @param {number} interval Specifies the interval in milliseconds between 2 and 5000 for the interval of
 * the clock cycle.  If the clock was already in auto mode, the clock interval timer will be stopped and
 * then restarted using the new interval.
 */
VirtualClock.prototype.set_interval = function(interval)
{
   const was_started = this.auto_clock;
   if(interval < 2)
      interval = 2;
   if(interval > 5000)
      interval = 5000;
   this.stop();
   this.interval = interval;
   if(was_started)
      this.start();
};


/**
 * Adds a call-back that should be called when the clock transitions on the rising edge.
 * 
 * @param {function} client Specifies the application function to call on the rising edge.
 */
VirtualClock.prototype.add_rising_client = function(client)
{ this.rising_edge_clients.push(client); };


/**
 * Adds a call-back that should be called when the clock transitions on the falling edge.
 * 
 * @param {function} client Specifies the application function to call on the falling edge.
 */
VirtualClock.prototype.add_falling_client = function(client)
{ this.falling_edge_clients.push(client); };

