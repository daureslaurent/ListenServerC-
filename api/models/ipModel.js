'use strict';
var mongoose = require('mongoose');

var IpSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  location:{
    country: String,
    city: String,
    region: String
  }
});

module.exports = mongoose.model('Data', DataSchema);