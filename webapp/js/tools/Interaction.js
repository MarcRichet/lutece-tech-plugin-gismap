/*global ol, drawTools, measureTools, specifInteracts, Editor, GlobalMap, alert*/

/**
 * Interaction Class manage interactions on the map
 */
var editorTools = null;

function Interaction(layerEdit, fieldParameters){
    'use strict';
    /**
     * editorTools is the manager of edition tools
     * @type {Editor}
     */
    if(fieldParameters[0] !== '' &&fieldParameters[0] !== undefined && layerEdit !== '' && layerEdit.length === 1) {
        editorTools = new Editor(layerEdit, fieldParameters);
    }
    /**
     * ListInteracts contains all interactions enable on the map
     * @type {Array}
     */
    this.ListInteracts = [];
    /**
     * ListInteracts contains all interactions enable on the map
     * @type {Array}
     */
    var ListInteractsTemp = [];
    /**
     * currentInteract contains the current Interaction
     * @type {string}
     */
    this.currentInteract = "None";

    /**
     *
     */
    this.manageActiveInteraction = function(){
        if(this.currentInteract === 'Select'){
            this.activeSpecificTool(false);
        }else if(this.currentInteract === "Measure"){
            this.activeMeasureTool(null, false);
        }else if(this.currentInteract === "Draw"){
            this.activeDrawTool(null, false);
        }else if(this.currentInteract === "Edit"){
            this.activeEditorTool(null, false);
        }else if(this.currentInteract === "SuggestPoiEdit"){
            this.activeEditorTool(null, false);
        }
    };

    /**
     * Interaction Private METHOD
     * activeSpecificTool enable or disable specific interaction
     * @param enable
     */
     this.activeSpecificTool = function (enable){
         specifInteracts.getSelectInteraction().setActive(enable);
    };

     /**
     * Interaction Private METHOD
     * activeMeasureTool enable or disable draw interaction
     */
    this.activeDrawTool = function(value, enable){
         drawTools.setActiveInteraction(value, enable);
    };

     /**
     * Interaction Private METHOD
     * activeMeasureTool enable or disable measure interaction
     */
    this.activeMeasureTool = function(value, enable){
         measureTools.setActiveInteraction(value, enable);
    };

     /**
     * Interaction Private METHOD
     * activeEditorTool enable or disable editor interaction
     */
    this.activeEditorTool = function(value, enable){
         editorTools.setActiveInteraction(value, enable);
    };

    /**
     * Interaction Public METHOD
     * initInteractions initialize interaction on the map
     */
    this.initInteractions = function(activeInteracts){
        var editorInteracts = null;
        for(var ctrl = 0; ctrl < activeInteracts.length; ctrl++) {
            if(activeInteracts[ctrl] === "Select") {
                this.ListInteracts.push(specifInteracts.getSelectInteraction());
                this.currentInteract = "Select";
            }
            if (activeInteracts[ctrl] === "Rotate") {
                this.ListInteracts.push(new ol.interaction.DragRotate());
            }
            if (activeInteracts[ctrl] === "ZoomBox") {
                this.ListInteracts.push(new ol.interaction.DragZoom());
            }
            if (activeInteracts[ctrl] === "Draw") {
                var drawInteracts = drawTools.initDrawTools();
                drawInteracts.forEach(function(val, key){
                    ListInteractsTemp.push(val);
                }, drawInteracts);
                for(var i = 0; i < ListInteractsTemp.length; i++){
                    this.ListInteracts.push(ListInteractsTemp[i]);
                }
                ListInteractsTemp = [];
            }
            if (activeInteracts[ctrl] === "Measure") {
               var measureInteracts = measureTools.initMeasureTools(GlobalMap);
                measureInteracts.forEach(function(val, key){
                    ListInteractsTemp.push(val);
                }, measureInteracts);
                for(var j = 0; j < ListInteractsTemp.length; j++){
                    this.ListInteracts.push(ListInteractsTemp[j]);
                }
                ListInteractsTemp = [];
            }
            if (activeInteracts[ctrl] === "Edit" || activeInteracts[ctrl] === "AutoEdit") {
                editorInteracts = editorTools.initEditInteraction('Draw');
                editorInteracts.forEach(function(val, key){
                    ListInteractsTemp.push(val);
                }, editorInteracts);
                for(var k = 0; k < ListInteractsTemp.length; k++){
                    this.ListInteracts.push(ListInteractsTemp[k]);
                }
                ListInteractsTemp = [];
                this.currentInteract = "Edit";
                this.setEditInteraction();
            }
            if (activeInteracts[ctrl] === "SuggestPOI") {
                editorInteracts = editorTools.initEditInteraction('Suggest');
                editorInteracts.forEach(function(val, key){
                    ListInteractsTemp.push(val);
                }, editorInteracts);
                for(var l = 0; l < ListInteractsTemp.length; l++){
                    this.ListInteracts.push(ListInteractsTemp[l]);
                }
                ListInteractsTemp = [];
                this.currentInteract = "Suggest";
                this.setEditInteraction();
            }
        }
    };


    /**
     * Interaction Public METHOD
     * setDrawInteraction define the current draw interaction
     */
    this.setSelectInteraction = function(){
        this.manageActiveInteraction();
        this.activeSpecificTool(true);
        this.currentInteract = "Select";
    };

    /**
     * Interaction Public METHOD
     * setDrawInteraction define the current draw interaction
     */
    this.setEditInteraction = function(){
        this.manageActiveInteraction();
        editorTools.getEditorTools();
        this.activeEditorTool("Act", true);
        this.currentInteract = "Edit";
    };

    /**
     * Interaction Public METHOD
     * setDrawInteraction define the current draw interaction
     * @param map
     */
    this.setDrawInteraction = function(value){
        this.manageActiveInteraction();
        drawTools.getDrawTools(value);
        this.activeDrawTool(value, true);
        this.currentInteract = "Draw";
    };

    /**
     * Interaction Public METHOD
     * setMeasureInteraction define the current measure interaction
     * @param map
     */
    this.setMeasureInteraction = function(value){
        this.manageActiveInteraction();
        measureTools.getMeasureTools(value);
        this.activeMeasureTool(value, true);
        this.currentInteract = "Measure";
    };

    /**
     * Interaction Public METHOD
     * getInteracts get the list of all interactions enable on the map
     * @returns {Array}
     */
    this.getInteracts = function(){
        return this.ListInteracts;
    };

     /**
     * Interaction Method
     * deleteFeatures is a method to call an action to delete all selected elements
     */
    this.deleteFeatures = function () {
        var selectFeatures = specifInteracts.getSelectedFeatures().getArray();
        if (selectFeatures.length !== 0) {
            var selectedLayer = specifInteracts.getSelectedLayer(selectFeatures[0]);
            if (selectedLayer === measureTools.getMeasureLayer()) {
                measureTools.cleanMeasureLayer(GlobalMap);
            } else if (selectedLayer === drawTools.getDrawLayer()) {
                if (selectFeatures.length === 1) {
                    selectedLayer.getSource().removeFeature(selectFeatures[0]);
                } else if (selectFeatures.length > 1) {
                    for (var selectFeature = 0; selectFeature < selectFeatures.length; selectFeature++) {
                        selectedLayer.getSource().removeFeature(selectFeatures[selectFeature]);
                    }
                }
            } else if (selectedLayer === editorTools.getEditLayer()){
                alert("Cette valeur appartient à la couche d'édition!");
            }
            specifInteracts.getSelectedFeatures().clear();
        }else {
            editorTools.deleteFeature();
            this.setEditInteraction();
        }
    };
}