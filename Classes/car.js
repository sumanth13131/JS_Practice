import Vehicle from "./vehicle.js"; // defalut export
import { getDistance } from "./map.js"; // named export

class Car extends Vehicle {
  constructor(cmpy, type, model, price, capacity) {
    super(cmpy, type, model, price);
    this.capacity = capacity;
  }

  getCapacity() {
    return this.capacity + " Seater";
  }
}

let car = new Car("KIA", "Car", "Q", "20L", 4);
console.log(car.getInfo());
console.log("Capacity :: " + car.getCapacity());
console.log("Speed :: " + Vehicle.speed(100, 10)); // Static method
