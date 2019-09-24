var EventEmitter = require("events");

var emitter = new EventEmitter();
/* Example 1
emitter.on("my_event", () => console.log("my_event fired"));

emitter.emit("my_event");
 */

/* Example 2 - Setting Params
emitter.on("my_event", (...number) => console.log(number));

emitter.emit("my_event", 123, 321, 12, 4);
 */

// Example 3 - Inharitance

class Dog extends EventEmitter {
  bark() {
    console.log("woof woof!");
  }

  sleep() {
    console.log("ZZZzzzzz...");
  }
}

var Rex = new Dog();

/* Rex.on("bark_please", Rex.bark);
Rex.on("bark_please", Rex.sleep);

Rex.emit("bark_please"); //           ⬇ name of the function obliged
Rex.removeListener("bark_please", Rex.bark);
Rex.emit("bark_please");
Rex.emit("bark_please"); */

Rex.once("bark_please", Rex.bark);
Rex.emit("bark_please");
Rex.emit("bark_please");
