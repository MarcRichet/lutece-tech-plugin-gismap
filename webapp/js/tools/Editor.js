/*global ol, alert, Map, projection, GlobalMap*/

/**
 * Editor Class manage all Edition of data on the map
 */
function Editor(layerEdit, fieldName) {
    'use strict';
    /**
     * editInteraction is the map to stock all edit interaction
     * @type {Map}
     */
    this.editInteraction = new Map();
    /**
     * geoJSONFormat is the format to write on the GeoJSON data
     * @type {ol.format.GeoJSON}
     */
    var geoJSONFormat = new ol.format.GeoJSON();
    /**
     * dirty is an array to stock the information of the edit feature
     * @type {{}}
     */
    var dirty = {};
    /**
     * fieldData is the field where we stock data value
     * @type {Element}
     */
    var fieldData = document.getElementById(fieldName['GeomGeoJson']);
    /**
     * fieldCentroidX is the field where we stock centroid value
     * @type {Element}
     */
    var fieldCentroidX = document.getElementById(fieldName['GeomCentroidX']);
    /**
     * fieldCentroidY is the field where we stock centroid value
     * @type {Element}
     */
    var fieldCentroidY = document.getElementById(fieldName['GeomCentroidY']);
    /**
     * fieldEditionStatus is the field where we stock centroid value
     * @type {Element}
     */
    var fieldEditionStatus = document.getElementById(fieldName['GeomState']);
    /**
     * editSource is the source of the data can be edit on the map
     * @type {String}
     */
    var editSource = fieldData.value;

    var editAvailable = true;
    /**
     * editLayer is the layer can be edit on the map
     * @type {ol.layer.Layer}
     */
    var editLayer = new ol.layer.Vector({
        name:"EditLayer",
        source: new ol.source.Vector()
    });
    /**
     * editProj is the projection of the data can be edit
     * @type {String}
     */
    var editProj = layerEdit[0];
    /**
     * editType is the type of the data can be edit
     * @type {String}
     */
    var editType = fieldName['TypeEdit'];
    /**
     * selectInteract is the interaction to select a feature on the map
     * @type {ol.interaction.Select}
     */
    this.selectInteract = new ol.interaction.Select();
    /**
     * modifyInteract is the interaction to modify a feature on the map
     * @type {ol.interaction.Modify}
     */
    this.modifyInteract = new ol.interaction.Modify({
        features: this.selectInteract.getFeatures()
    });
    /**
     * drawInteract is the interaction to draw a feature on the map
     * @type {ol.interaction.Draw}
     */
    this.drawEditInteract = new ol.interaction.Draw({
        source: editLayer.getSource(),
        type: editType
    });
    /**
     * suggestPoiEdit is the marker to know the mode of edition on the map
     * @type {ol.interaction.Draw}
     */
    this.suggestPoiEdit = false;

    /**
     * Editor Method
     * getLevel is a getter to know the editor interaction use
     * @returns {boolean}
     */
    this.getLevel = function(){
        return true;
    };

    /**
     * Editor Method
     * getSelectInteract is a getter to access at select editor interaction
     * @returns {*}
     */
    this.getSelectEditInteract = function () {
        return this.selectInteract;
    };

    /**
     * Editor Method
     * getSelectedEditFeatures is a getter to access at all features selected
     * @returns {*}
     */
    this.getSelectedEditFeatures = function () {
        return this.selectInteract.getFeatures();
    };

    /**
     * Editor Method
     * getModifyInteract is a getter to access at modify editor interaction
     * @returns {*}
     */
    this.getModifyEditInteract = function () {
        return this.modifyInteract;
    };

    /**
     * Editor Method
     * getDrawInteract is a getter to access at draw editor interaction
     * @returns {*}
     */
    this.getDrawEditInteraction = function () {
        return this.drawEditInteract;
    };

    /**
     * Editor Method
     * getDrawInteract is a getter to access at draw editor interaction
     * @returns {*}
     */
    this.getEditLayer = function () {
        return editLayer;
    };

    this.getSuggestPoiEdit = function(){
        return this.suggestPoiEdit;
    };

    /**
     * Editor Method
     * initEditInteraction initialize the List of interacts to edit data
     */
    this.initEditInteraction = function (mode) {
        if(editSource !== '') {
            editLayer.getSource().addFeatures(geoJSONFormat.readFeatures(editSource));
        }
        if(mode === 'Draw') {
            this.editInteraction.set('Select', this.getSelectEditInteract());
            this.editInteraction.set('Modify', this.getModifyEditInteract());
            this.editInteraction.set('Draw', this.getDrawEditInteraction());
            this.suggestPoiEdit = false;
            this.setActiveInteraction('Edit', true);
        }else if(mode === 'Suggest') {
            /* Lignes à décommenter pour le géocodage inverse
            this.editInteraction.set('Select', this.getSelectEditInteract());
            this.editInteraction.set('Modify', this.getModifyEditInteract());*/
            this.suggestPoiEdit = true;
            this.setActiveInteraction('Edit', true);
        }
        return this.editInteraction;
    };

    /**
     * Editor METHOD
     * setActiveInteraction enable or disable editor interaction
     * @param value
     * @param active
     */
    this.setActiveInteraction = function (value, active) {
        if (value === null) {
            this.editInteraction.forEach(function (val, key) {
                val.setActive(false);
            });
        } else if (value === 'Edit') {
            this.editInteraction.get('Select').setActive(active);
            this.editInteraction.get('Modify').setActive(active);
        } else if (value === 'Add') {
            if(active === true && fieldData.value !== '') {
                alert("Il ne peut avoir plusieurs géométries pour un enregistrement!");
            }else {
                this.editInteraction.get('Draw').setActive(active);
            }
        }
    };

    /**
     * Editor METHOD
     * setAutoEditorTools is a setter to activate all interaction automatically
     * @param value
     * @returns {Array}
     */
    this.setAutoEditorTools = function (value) {
        var listEditor = [];
        if (value === 'Edit') {
            listEditor.push(this.editInteraction.get('Select'));
            listEditor.push(this.editInteraction.get('Modify'));
        } else if (value === 'Add'){
            listEditor.push(this.editInteraction.get('Draw'));
        }
        return listEditor;
    };

    /**
     * Editor METHOD
     * getDrawTools is a getter to access at the draw interaction
     * @param value
     * @returns {Array}
     */
    this.getEditorTools = function (value) {
        var listEditor = [];
        if (value === 'Edit') {
            listEditor.push(this.editInteraction.get('Select'));
            listEditor.push(this.editInteraction.get('Modify'));
        } else if (value === 'Add'){
            listEditor.push(this.editInteraction.get('Draw'));
        }
        return listEditor;
    };

    /**
     * Editor METHOD
     * writeGeoJSON send all information at Lutece to insert data in the database
     * @returns {*[]}
     */
     function writeGeoJSON(feature){
        if(editAvailable) {
            var point = getCentroid(feature.getGeometry());
            fieldCentroidX.value = point.getCoordinates()[0];
            fieldCentroidY.value = point.getCoordinates()[1];
            fieldData.value = geoJSONFormat.writeFeature(feature, {
                featureProjection: projection.getProjection().getCode(),
                dataProjection: editProj
            });
            fieldEditionStatus.value = false;
        }
    }

    /**
     * Editor METHOD
     * getCentroid calculate the centroid of the current geometry
     * @param geom
     * @returns {*}
     */
    function getCentroid(geom) {
        if(editType === 'Point') {
            return geom;
        }else{
            return new ol.geom.Point(ol.extent.getCenter(geom.getExtent()));
        }
    }

    /**
     * Editor METHOD
     * getSelectedEditFeatures().on is a Listener to affect an ID at the current selection
     */
    this.getSelectedEditFeatures().on('add', function (evt) {
        var feature = evt.element;
        feature.on('change', function (evt) {
            dirty[evt.target.getId()] = true;
        });
    });

    /**
     * Editor METHOD
     * getSelectedEditFeatures().on is a Listener to send information of the data edit
     */
    this.getSelectedEditFeatures().on('remove', function (evt) {
        writeGeoJSON(evt.element);
    });

    /**
     * Editor METHOD
     * drawEditInteract.on is a Listener to add a feature
     */
    this.drawEditInteract.on('drawstart', function (evt) {
        if(fieldData.value !== ''){
            editAvailable = false;
            if(editType !== 'Point') {
                this.finishDrawing();
            }
        }
    });

    /**
     * Editor METHOD
     * drawEditInteract.on is a Listener to add a feature
     */
    this.drawEditInteract.on('drawend', function (evt) {
        if(editAvailable) {
            writeGeoJSON(evt.feature);
        }
    });

     /**
     * Editor METHOD
     * validateEdition is the manager to run the method to actualise database
     * @returns {*}
     */
    this.addPoint = function(point) {
        if(editType === 'Point'){
            var feature = new ol.Feature(point);
            editLayer.getSource().addFeature(feature);
            writeGeoJSON(feature);
        }
    };

    /**
     * Editor METHOD
     * restartEdition clean the table of the current edition
     */
    this.restartEdition = function() {
        fieldData.value = '';
        fieldCentroidX.value = '';
        fieldCentroidY.value = '';
    };

    /**
     * Editor METHOD
     * cleanEdition restore the layer at this initial source
     */
    function cleanEdition() {
        editLayer.getSource().clear();
        editLayer.getSource().addFeatures(geoJSONFormat.readFeatures(editSource));
    }
}