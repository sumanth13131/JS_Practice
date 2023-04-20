export default class Vehicle {
  constructor(company, type, model, price) {
    (this.company = company),
      (this.type = type),
      (this.model = model),
      (this.price = price);
  }

  getInfo() {
    return {
      company: this.company,
      type: this.type,
      model: this.model,
      price: this.price,
    };
  }
  static speed(dis, time) {
    return dis / time + " kmph";
  }
}
