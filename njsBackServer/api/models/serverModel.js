'use strict';
var mongoose = require('mongoose');

var DataSchema = new mongoose.Schema({
  name: String,
  ip: {
    type: String,
    required: true
  },
  port: {
    type: Number,
    required: true
  },
  pid: String,
  state: Boolean,
  redirect: String
});

module.exports = mongoose.model('Server', DataSchema);