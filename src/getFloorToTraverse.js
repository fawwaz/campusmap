const axios = require('axios')
const cheerio = require('cheerio')
const fs = require('fs')
const logUpdate = require('log-update')

const url = 'http://petakampus.itb.ac.id/search/search_map.php'
const baseUrl = 'http://petakampus.itb.ac.id/'
let endpoint = 'lantai_gmap2.php?id_gedung='+100128+'&id_lantai='+10012802+'&gid='+72


const rooms = []
let traversedFloor = {}
console.log(`Fetching from '${url}' at ${new Date().toLocaleString()}.`)
axios.get(url).then((response) => {
  console.log(`Got response at ${new Date().toLocaleString()}, parsing data.`)
  var $ = cheerio.load(response.data);
  $('td').each((i, elm) => {
    let child = $(elm).children().first()
    // remove the chevron and unneeded spaces
    let childText = child.text().split('»').join('').slice(1).split(', ')
    let name = childText.slice(0, -1).join(', ')
    let building = childText[childText.length - 1]
    let attrib = child.attr('onclick').split('javascript:lookat2(').join('').split(')').join('').split(', ').join(',').split(',')
    // The lat and lon here is just the general position of the building the room is in.
    let room = {
      name,
      building,
      lat: attrib[0],
      lon: attrib[1],
      alt: attrib[2],
      heading: attrib[3],
      tilt: attrib[4],
      range: attrib[5],
      buildingId: attrib[6],
      floorId: attrib[7],
      gId: attrib[8]
    }
    rooms.push(room)
  })
  console.log(`Returning ${rooms.length} parsed rooms.`)
  return rooms
}).then(roomsResponse => {
  let floorsToTraverse = {}
  let buildingsToTraverse = {}
  roomsResponse.forEach((room, i) => {
    floorsToTraverse['' + room.floorId] = []
    buildingsToTraverse['' + room.buildingId] = []
  })
  console.log(`There are ${Object.keys(buildingsToTraverse).length} buildings`)
  console.log(`There are ${Object.keys(floorsToTraverse).length} floors`)
  return {
    roomsResponse,
    floorsToTraverse,
    buildingsToTraverse
  }
}).then((obj) => {
  let {roomsResponse, floorsToTraverse, buildingsToTraverse} = obj
  roomsResponse.forEach((room, i) => {
    floorsToTraverse[room.floorId].push(room)
  })
  Object.keys(floorsToTraverse).forEach(floor => {
    buildingsToTraverse[floor.slice(0, -2)].push(floor)
  })
  // console.log(buildingsToTraverse)
  // console.log(floorsToTraverse)
  // console.log(roomsResponse)
  return {
    roomsResponse,
    floorsToTraverse,
    buildingsToTraverse
  }
})

.then(obj => {
  let {roomsResponse, floorsToTraverse, buildingsToTraverse} = obj
  let roomsProcessed = 0
  let floorsProcessed = 0
  Object.keys(buildingsToTraverse).forEach(building => {
    let floorsInThisBuilding = buildingsToTraverse[building]
    let buildingName = floorsInThisBuilding.reduce((prevName, floor, i) => {
      let thisFloorsName = floorsToTraverse[floor].reduce((prevNameFloor, room, i) => {
        if (prevNameFloor.length > room.building.length) {return prevNameFloor}
        return room.building
      }, '')
      if (prevName.length > thisFloorsName.length) {return prevName}
      return thisFloorsName
    }, '')
    console.log(`${buildingName} (${building}): ${floorsInThisBuilding.length} floors.`)
    floorsInThisBuilding.forEach((floor, i) => {
      let roomsInThisFloor = floorsToTraverse[floor]
      console.log(`  (${i}) Floor ${floor.slice(-2)}: ${roomsInThisFloor.length} rooms.`)
      roomsInThisFloor.forEach(room => {
        console.log(`    > Room ${room.name} of building ${room.building}. GID = ${room.gId}`)
      })
    })
  })
  return {
    rooms: roomsResponse,
    floors: floorsToTraverse,
    buildings: buildingsToTraverse
  }
})
