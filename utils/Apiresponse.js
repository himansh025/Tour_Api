class Apiresponse {
  constructor(statucode, data, message = "Success") {
    this.statucode = statucode;
    this.data = data;
    this.message = message;
    this.success = statucode < 400;
  }
}
module.exports = Apiresponse;