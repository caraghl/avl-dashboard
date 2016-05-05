var geoJSON;
var filters;

var colourAPF = '#4180c8';
var colourCC = '#b841c8';
var colourAGD = '#c88941';
var colourJJ = '#c8b841';
var colourLA = '#41c88e';
var colourALS = '#f31616';


jQuery.ajax( {

  url: '/avl-dashboard',
  type: 'GET',
  success: function(items) {
  	geoJSON = items;
    console.log('successfully loaded!');
    addMarkers();

}
});

function addMarkers() {

	var myLayer = L.mapbox.featureLayer().addTo(map);

	myLayer.on('layeradd', function(e) {
	    var marker = e.layer, feature = marker.feature;
	    var popupContent =  '<strong>' + feature.properties.Organisation + '</strong><br> ' +
	    					feature.properties.SystemName + '<br> ' +
	    					'<i style="color: #0066ff; font-size: 16px;">' + feature.properties.SpecificSystemTypeDescription 
	    					+ ' ('+ feature.properties.SystemStatus +')</i><br> ' +
							feature.properties.Address;


	    marker.bindPopup(popupContent,{
	        closeButton: false,
	        minWidth: 320
	    });

	    myLayer.on('mouseover', function(e) {
    		e.layer.openPopup();
		});
		myLayer.on('mouseout', function(e) {
		    e.layer.closePopup();
		});

		marker.setIcon(L.mapbox.marker.icon({
	                    'marker-color': getOrgColour(feature.properties.Organisation),
	                    'marker-size': 'small'
	    }));

	});

	// Add features to the map
	myLayer.setGeoJSON(geoJSON);
	filters = document.getElementById('filters');

	var typesObj = {}, types = [];
	var features = map.featureLayer.getGeoJSON().features;
	var features = myLayer.getGeoJSON().features;

	for (var i = 0; i < features.length; i++) {
	    typesObj[features[i].properties['Organisation']] = true;
	}
	for (var k in typesObj) types.push(k);

	var checkboxes = [];

	// Create a filter interface.
	for (var i = 0; i < types.length; i++) {
		var item = filters.appendChild(document.createElement('div'));
		var checkbox = item.appendChild(document.createElement('input'));
		var label = item.appendChild(document.createElement('label'));
		checkbox.type = 'checkbox';
		checkbox.id = types[i];
		checkbox.checked = true;
		label.innerHTML = types[i];
		label.setAttribute('for', types[i]);
		label.setAttribute('style', 'color:' + getOrgColour(types[i]));
		checkbox.addEventListener('change', update);
		checkboxes.push(checkbox);
	}

	function update() {
		var enabled = {};
		for (var i = 0; i < checkboxes.length; i++) {
		  if (checkboxes[i].checked) enabled[checkboxes[i].id] = true;
		}
		myLayer.setFilter(function(feature) {
		  return (feature.properties['Organisation'] in enabled);
	  });

	}

}

function getOrgColour(org) {
	if (org === 'Police' || org === 'ODPP') { return colourAPF;
	} else if (org === 'Community Corrections' || org ==='Community Relations Commission' || org ==='Corrective Services') { return colourCC;
	} else if (org === 'Attorney General Dept') { return colourAGD;
	} else if (org === 'Juvenile Justice') { return colourJJ;
	} else if (org === 'Legal Aid'){ return colourLA;
	} else if (org === 'Aboriginal Legal Services'){ return colourALS;}
	return colourAGD;
}