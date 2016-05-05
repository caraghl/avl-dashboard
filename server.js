var XLSX = require('xlsx');
var express = require('express');
var GeoJSON = require('geojson');
//var jsonfile = require('jsonfile');
var app = express();
var PORT = process.env.PORT || 3000;
var workbook = XLSX.readFile('resources/Geospatial data Master  v0.9.xls');
var workbookData;
//var geoJSON;

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '..');
});

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
	res.status("200");
});

app.get('/avl-dashboard', function (req, res) {
	console.log('/avl-dashboard');
	var workbookData = to_json(workbook);
	var filteredWorkbookData = filterWorkbookData(workbookData);
	var geoJSON = convertToGeoJSON(filteredWorkbookData);
	res.json(geoJSON);
});


function to_json(workbook) {
  var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] = roa;
        }
    });
    var contents = result.CodecGeospatialMaster;
	var json = JSON.stringify(contents);
	contents = JSON.parse(json);
    return contents;
}


function filterWorkbookData(workbookData) {

	var filteredWorkbookData = workbookData.map(function(obj) {
		var filteredObj = {};
		filteredObj.Organisation = obj.Organisation;
		filteredObj.SystemName = obj.SystemName;
		filteredObj.PostCode = obj.PostCode;
		filteredObj.Suburb = obj.Suburb;
		filteredObj.CodecAddress = obj.CodecAddress;
		filteredObj.Address = obj.Address;
		filteredObj.LocationName = obj.LocationName;
		filteredObj.SpecificSystemTypeDescription = obj.SpecificSystemTypeDescription;
		filteredObj.Geocode = obj.Geocode;
		filteredObj.Latitude = obj.Latitude;
		filteredObj.Longitude = obj.Longitude;
		filteredObj.IPAddress = obj.IPAddress;
		if(typeof obj.SystemStatus === 'undefined') {
			filteredObj.SystemStatus = 'Idle';
		} else {
			filteredObj.SystemStatus = obj.SystemStatus;
		}
		return filteredObj;
	});

	return filteredWorkbookData;
}

function convertToGeoJSON(json) {
	var geoJSON = GeoJSON.parse(json, {Point: ['Latitude', 'Longitude'], include: [
		'Organisation',
		'SystemName',
		'PostCode',
		'Suburb',
		'CodecAddress',
		'Address',
		'LocationName',
		'SpecificSystemTypeDescription',
		'Geocode',
		'SystemStatus']});
	
	return geoJSON;
}

 