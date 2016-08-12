'use strict'
// var mongoose = require('mongoose')
// // Set up MongoDB connection
// var connection = mongoose.connect('localhost/campusmap')
//
var Room = require('./models').Room
var Floor = require('./models').Floor
var Building = require('./models').Building
var FloorPolygon = require('./models').FloorPolygon
var VRoomPolygon = require('./models').VRoomPolygon

module.exports.rooms = function * rooms(next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let newRooms = yield Room.find({})
  // Set rooms as JSON response
  this.body = newRooms
}

module.exports.roomsByName = function * roomsByName(name, next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let rooms = yield Room.find({'name': {'$regex': name, '$options': 'i'}})
  // Set rooms as JSON response
  this.body = rooms
}
module.exports.floors = function * floors(next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let newFloors = yield Floor.find({})
  // Set rooms as JSON response
  this.body = newFloors
}

module.exports.floorsByName = function * floorsByName(name, next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let floors = yield Floor.find({'name': {'$regex': name, '$options': 'i'}})
  // Set rooms as JSON response
  this.body = floors
}
module.exports.buildings = function * buildings(next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let newBuildings = yield Building.find({})
  // Set rooms as JSON response
  this.body = newBuildings
}

module.exports.buildingsByName = function * buildingsByName(name, next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let buildings = yield Building.find({'name': {'$regex': name, '$options': 'i'}})
  // Set rooms as JSON response
  this.body = buildings
}

module.exports.floorPolygons = function * floorPolygons(next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let newFloorPoly = yield FloorPolygon.find({})
  // Set rooms as JSON response
  this.body = newFloorPoly
}

module.exports.floorPolygonsByName = function * floorPolygonsByName(name, next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let floors = yield FloorPolygon.find({'name': {'$regex': name, '$options': 'i'}})
  // Set rooms as JSON response
  this.body = floors
}
module.exports.vRoomPolygons = function * vRoomPolygons(next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let newRooms = yield VRoomPolygon.find({})
  // Set rooms as JSON response
  this.body = newRooms
}

module.exports.vRoomPolygonsByName = function * vRoomPolygonsByName(name, next) {
  if ('GET' != this.method) return yield next;
  // Query for all rooms
  let rooms = yield VRoomPolygon.find({'name': {'$regex': name, '$options': 'i'}})
  // Set rooms as JSON response
  this.body = rooms
}

module.exports.home = function * home(next) {
  if ('GET' != this.method) return yield next;
  this.body = yield {msg: 'welcome to campusmap API server 🎉'}
}

module.exports.head = function *(){
  return;
};

module.exports.options = function *() {
  this.body = "Allow: HEAD,GET,PUT,DELETE,OPTIONS";
};

module.exports.trace = function *() {
  this.body = "Smart! But you can't trace.";
};
