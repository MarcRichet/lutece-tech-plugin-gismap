/*global ol*/
/**
 * InterfaceElements Class manage all elements included in the map
 */
var InterfaceElements = function(app, interfaceValues, parameters) {
    'use strict';
    /**
     * ListElements is a list of all graphics components of the map
     * @type {Array}
     */
    this.ListElements = [];

    /**
     * InterfaceElement Method
     * This function initialise all graphics components of the map
     * @param interfaceValues is an array of all object with interaction
     * @param parameters is an array of all parameters of the map
     * @param opt_options
     * @constructor
     */
    app.CmdControl = function(interfaceValues, parameters, opt_options) {
        var options = opt_options || {};
        var element = document.createElement('div');
        var rulerActive = false;
        element.className = 'ol-unselectable ol-mycontrol';
        for (var i = 0; i < parameters['Interacts'].length; i++) {
            if (parameters['Interacts'][i] === "SuggestPOISearch") {
                var suggestPoiText = document.createElement('input');
		        suggestPoiText.setAttribute('type', 'text');
                suggestPoiText.setAttribute('id','addressSuggestPoi');
                suggestPoiText.setAttribute('name','addressSuggestPoi');
                suggestPoiText.setAttribute('class','ui-autocomplete-input');
                var handleSuggestPoiText = function (e) {
                    interfaceValues["suggestPoiLocator"].locateBySuggestPoi();
                };
                suggestPoiText.addEventListener('focus', handleSuggestPoiText, false);
                element.appendChild(suggestPoiText);
            }
            if (parameters['Interacts'][i] === "Draw") {
                var buttonDrawPoint = document.createElement('button');
                buttonDrawPoint.setAttribute('type','button');
                buttonDrawPoint.innerHTML = 'Pt';
                var buttonDrawLine = document.createElement('button');
                buttonDrawLine.setAttribute('type','button');
                buttonDrawLine.innerHTML = 'L';
                var buttonDrawPolygon = document.createElement('button');
                buttonDrawPolygon.setAttribute('type','button');
                buttonDrawPolygon.innerHTML = 'Pn';
                var handleDrawPoint = function (e) {
                    interfaceValues["interact"].setDrawInteraction('Point');
                };
                var handleDrawLine = function (e) {
                    interfaceValues["interact"].setDrawInteraction('LineString');
                };
                var handleDrawPolygon = function (e) {
                    interfaceValues["interact"].setDrawInteraction('Polygon');
                };
                buttonDrawPoint.addEventListener('click', handleDrawPoint, false);
                buttonDrawPoint.addEventListener('touchstart', handleDrawPoint, false);
                buttonDrawLine.addEventListener('click', handleDrawLine, false);
                buttonDrawLine.addEventListener('touchstart', handleDrawLine, false);
                buttonDrawPolygon.addEventListener('click', handleDrawPolygon, false);
                buttonDrawPolygon.addEventListener('touchstart', handleDrawPolygon, false);
                element.appendChild(buttonDrawPoint);
                element.appendChild(buttonDrawLine);
                element.appendChild(buttonDrawPolygon);
            }
            if (parameters['Interacts'][i] === 'Measure') {
                var buttonMeasureLen = document.createElement('button');
                buttonMeasureLen.setAttribute('type','button');
                buttonMeasureLen.innerHTML = 'Len';
                var buttonMeasureArea = document.createElement('button');
                buttonMeasureArea.setAttribute('type','button');
                buttonMeasureArea.innerHTML = 'Area';
                var handleMeasureLen = function (e) {
                    interfaceValues["interact"].setMeasureInteraction('Length');
                };
                var handleMeasureArea = function (e) {
                    interfaceValues["interact"].setMeasureInteraction('Area');
                };
                buttonMeasureLen.addEventListener('click', handleMeasureLen, false);
                buttonMeasureLen.addEventListener('touchstart', handleMeasureLen, false);
                buttonMeasureArea.addEventListener('click', handleMeasureArea, false);
                buttonMeasureArea.addEventListener('touchstart', handleMeasureArea, false);
                element.appendChild(buttonMeasureLen);
                element.appendChild(buttonMeasureArea);
            }
            if (parameters['Interacts'][i] === 'Edit') {
                var buttonEdit = document.createElement('button');
                buttonEdit.setAttribute('type','button');
                buttonEdit.innerHTML = 'Edit';
                var handleEdit = function (e) {
                    interfaceValues["interact"].setEditInteraction();
                };
                buttonEdit.addEventListener('click', handleEdit, false);
                buttonEdit.addEventListener('touchstart', handleEdit, false);
                element.appendChild(buttonEdit);
            }
            if (parameters['Interacts'][i] === 'Select') {
                var buttonSelect = document.createElement('button');
                buttonSelect.setAttribute('type','button');
                buttonSelect.innerHTML = 'Select';
                var handleSelect = function (e) {
                    interfaceValues["interact"].setSelectInteraction();
                };
                buttonSelect.addEventListener('click', handleSelect, false);
                buttonSelect.addEventListener('touchstart', handleSelect, false);
                element.appendChild(buttonSelect);
            }
            if (parameters['Interacts'][i] === 'GPS') {
                var buttonGPS = document.createElement('button');
                buttonGPS.setAttribute('type','button');
                buttonGPS.innerHTML = 'GPS';
                var handleGPS = function (e) {
                    interfaceValues["geoPoint"].manageGPS();
                };
                buttonGPS.addEventListener('click', handleGPS, false);
                buttonGPS.addEventListener('touchstart', handleGPS, false);
                element.appendChild(buttonGPS);
            }
            if (parameters['Interacts'][i] === 'Draw' || parameters['Interacts'][i] === 'Measure'|| parameters['Interacts'][i] === 'Edit'|| parameters['Interacts'][i] === 'AutoEdit'){
                if(rulerActive === false) {
                    var buttonRuler = document.createElement('button');
                    buttonRuler.setAttribute('type','button');
                    buttonRuler.innerHTML = 'Ruler';
                    var handleClean = function (e) {
                        interfaceValues["interact"].deleteFeatures();
                    };
                    buttonRuler.addEventListener('click', handleClean, false);
                    buttonRuler.addEventListener('touchstart', handleClean, false);
                    element.appendChild(buttonRuler);
                    rulerActive = true;
                }
            }
        }
        if (parameters['Popup'].length !== 0) {
            var buttonInfo = document.createElement('button');
            buttonInfo.setAttribute('type','button');
            buttonInfo.innerHTML = 'I';
            var handlePopup = function (e) {
                interfaceValues["popup"].managePopup('on');
            };
            buttonInfo.addEventListener('click', handlePopup, false);
            element.appendChild(buttonInfo);
        }
        ol.control.Control.call(this, {
            element: element,
            target: options.target
        });
    };
    ol.inherits(app.CmdControl, ol.control.Control);

    /**
     * InterfaceElement Method
     * getElements is the getter to access at the list of graphics components
     * @returns {Array} the list of graphics components
     */
    this.getElements = function(){
        this.ListElements.push(new app.CmdControl(interfaceValues, parameters));
        return this.ListElements;
    };
};