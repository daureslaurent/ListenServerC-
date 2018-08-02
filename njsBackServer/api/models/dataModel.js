'use strict';
var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true
  },
  date: {
    type: Number,
    required: true
  },
  data:{
    type: String
  }
});

module.exports = mongoose.model('Data', DataSchema);