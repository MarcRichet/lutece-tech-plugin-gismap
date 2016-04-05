/*global ol, PopupForm*/
/**
 * Popup Class manage all popups included in the map
 */
var Popup = function(GlobalMap, idMap, parameters) {
    'use strict';
    /**
     * popupForm is the reference of the form of the Popup
     * @type {PopupForm}
     */
    var popupForm = new PopupForm(idMap);

    /**
     * interact stock a reference of the current interact of the map
     * @type {Interaction}
     */
    var interact = null;

    /**
     * queries stock the value to display data in the popup
     * @type {Array}
     */
    var queries = [];
    /**
     * popupKey is the key of the listener to add and remove it of the map
     * @type {string}
     */
    var popupKey = '';
    /**
     * overlay is the overlay of the popup
     * @type {ol.Overlay.Popup}
     */
    var overlay = new ol.Overlay.Popup();
    /**
     * queryData contains the reference of the data can be integrate in the popup
     * @type {Array}
     */
    var queryData = initOverlayPopupElements(parameters);
    /**
     * queryLayers contains the reference of the data can be integrate in the popup
     * @type {Array}
     */
    var queryLayers = initOverlayPopupLayers(parameters);

    /**
     * Popup Method
     * setInteract is a setter to define the interact reference
     * @param newInteract
     */
    var setInteract = function(newInteract){
        interact = newInteract;
    };

    /**
     * Popup Method
     * initOverlayPopupElements initialise the reference of the data popup
     * @param parameters is the array of parameters to define popups informations
     * @returns {Array} is the array with key value of all popups
     */
    function initOverlayPopupElements(parameters){
        var queryDataInit = [];
        for(var i = 0; i < parameters.length; i++){
            queryDataInit[parameters[i][0]] = parameters[i][1];
        }
        return queryDataInit;
    }

     /**
     * Popup Method
     * initOverlayPopupElements initialise the reference of the data popup
     * @param parameters is the array of parameters to define popups informations
     * @returns {Array} is the array with key value of all popups
     */
    function initOverlayPopupLayers(parameters){
        var queryDataInit = [];
        for(var i = 0; i < parameters.length; i++){
            queryDataInit.push(parameters[i][0]);
        }
        return queryDataInit;
    }

    /**
     * Popup Method
     * displaySimplePopup display the simple popup with all this data
     * @param id is the identifiant of the selected elements
     */
    var displaySimplePopup = function(id){
        overlay.hide();
        var coordinates = queries[id][0];
        var layerInfo = queries[id][1];
        var feature = queries[id][2];
        var data = '';
        var keys = feature.getKeys();
        var keysQuery = queryData[layerInfo];
        for (var j = 0; j < keys.length; j++) {
            for (var k = 0; k < keysQuery.length; k++) {
                if (keysQuery[k] === keys[j]) {
                    data = data + popupForm.definePopupSimpleForm(keys[j], feature, keysQuery[k]);
                }
            }
        }
        popupForm.displayPopupForm(overlay, coordinates, data);
    }

    /**
     * Popup Method
     * definePopup create the popup in function of the data select
     * @param evt is the event catch by the listener
     * @param layerInfo is an array to contains all names of layers catch
     * @param features is an array to contains all features catch
     * @param wmsLayers is an array to contains all wms layers catch
     * @param count is the count of the features
     * @param id is the max of element into the queries array
     */
    function definePopup(evt, layerInfo, features, wmsLayers, count, id){
        var data = '';
        if(layerInfo.length === 1){
            if(count < 2) {
                queries[id] = [evt.coordinate, layerInfo, features[layerInfo+'0']];
                displaySimplePopup(id);
            }else{
                for(var i = 0; i < count; i++){
                    queries[id] = [evt.coordinate, layerInfo, features[layerInfo+i]];
                    data = data + popupForm.definePopupMultiForm(layerInfo, id, features[layerInfo+i].get(queryData[layerInfo][1]), evt);
                    id++;
                }
                popupForm.displayPopupForm(overlay, evt.coordinate, data);
            }
        }else if(layerInfo.length > 1){
            for (var l = 0; l < layerInfo.length; l++) {
                if(wmsLayers[layerInfo[l]] !== null && wmsLayers[layerInfo[l]] !== undefined){
                    queries[id] = [evt.coordinate, layerInfo[l], wmsLayers[layerInfo[l]]];
                    data = data + popupForm.definePopupMultiForm(layerInfo[l], id, wmsLayers[layerInfo[l]].get(queryData[layerInfo[l]][1]), evt);
                    id++;
                }else{
                    for(var m = 0; m < count; m++){
                        if(features[layerInfo[l]+m] !== null && features[layerInfo[l]+m] !== undefined){
                            var queryFeature = features[layerInfo[l]+m];
                            queries[id] = [evt.coordinate, layerInfo[l], queryFeature];
                            data = data + popupForm.definePopupMultiForm(layerInfo[l], id, queryFeature[layerInfo[l]].get(queryData[layerInfo[l]][1]), evt);
                            id++;
                        }
                    }
                }
            }
            popupForm.displayPopupForm(overlay, evt.coordinate, data);
        }
    }

    /**
     * Popup Method$
     * initiatePopup catch the data and analyze it to create the popup
     * @param evt is the event catch by the listener
     */
    function initiatePopup(evt){
        overlay.hide();
        queries = [];
        var layerInfo = [];
        var features = [];
        var wmsLayers = [];
        var count = 0;
        var id = 0;
        GlobalMap.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
            if(queryData[layer.get('title')] !== null && queryData[layer.get('title')] !== undefined) {
                var unknown = true;
                for (var i = 0; i < layerInfo.length; i++) {
                    if (layerInfo[i] === layer.get('title')) {
                        unknown = false;
                    }
                }
                if (unknown === true) {
                    layerInfo.push(layer.get('title'));
                }
                features[layer.get('title')+count] = feature;
                count++;
            }
        });
        /*GlobalMap.forEachLayerAtPixel(evt.pixel, function (layer) {
            console.log(layer.getSource().getGetFeatureInfo())
            if(queryData[layer.get('title')] !== null && queryData[layer.get('title')] !== undefined) {
                var unknown = true;
                for (var i = 0; i < layerInfo.length; i++) {
                    if (layerInfo[i] === layer.get('title')) {
                        unknown = false;
                    }
                }
                if (unknown === true) {
                    layerInfo.push(layer.get('title'));
                    wmsLayers[layer.get('title')] = layer;
                }
            }
        });*/
        definePopup(evt, layerInfo, features, wmsLayers, count, id);
    }

    /**
     * Popup Method
     * managePopup add or remove the overlay of the map and the listener
     * @param value is a marker to enable or disable the popup overlay and his listener
     */
    var managePopup = function(value){
        if(value === 'off'){
            overlay.hide();
            GlobalMap.removeOverlay(overlay);
            GlobalMap.unByKey(popupKey);
        }else if(value === 'on'){
            interact.manageActiveInteraction();
            GlobalMap.addOverlay(overlay);
            popupKey = GlobalMap.on('singleclick', function(evt){initiatePopup(evt);});
        }
    };

    return{
        displaySimplePopup: displaySimplePopup,
        managePopup: managePopup,
        setInteract: setInteract
    };
};