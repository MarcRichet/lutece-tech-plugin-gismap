/*global ol, proj4, GisMap*/
/**
 * File to call the Gis Component with all parameters
 */

/**
 * Method to start gis component to LUTECE
 */

//init_carto = function(idMap, globalParameters, parameters) {

var idMap = 'map';
var globalParameters = [];
var parameters = [];
var fieldParameters = [];
ol.proj.setProj4(proj4);
parameters.push(parameters['Projection']='EPSG:2154');
parameters.push(parameters['Overview']=false);
parameters.push(parameters['ZoomSlider']=false);
parameters.push(parameters['ZoomExtent']=true);
parameters.push(parameters['ScaleBar']=true);
parameters.push(parameters['MousePosition']=false);
parameters.push(parameters['FullScreen']=false);
parameters.push(parameters['Rotate']=true);
parameters.push(parameters['ZoomZone']=true);
parameters.push(parameters['Select']=true);
parameters.push(parameters['Draw']=true);
parameters.push(parameters['Measure']=false);
parameters.push(parameters['AutoEdit']=true);
parameters.push(parameters['LayerControl']=true);
parameters.push(parameters['SuggestPOISearch']= false);
parameters.push(parameters['SuggestPOIParams']=['https://teleservices.paris.fr/SuggestPOI_L93/rest/services/SuggestPOI.jsp','gismap',3]);
parameters.push(parameters['GPS']=false);
parameters.push(parameters['Print']=true);
parameters.push(parameters['LayerEdit']='EPSG:4326');
parameters.push(parameters['Extent']='');
parameters.push(parameters['ZoomSelect']='11');
parameters.push(parameters['Zoom']=['0','22']);
parameters.push(parameters['DefaultBackGround']='OSM');
parameters.push(parameters['BackGround1']=['OSM',null]);
parameters.push(parameters['BackGround2']=['MapQuest','sat']);
parameters.push(parameters['WMS-Base1']=['World_Simple','GeoServer','http://demo.boundlessgeo.com/geoserver/wms','ne:ne','GeoServer-WMS-Base']);
parameters.push(parameters['WMS-Base2']=['Otrho_Paris','AGS-IMS','http://capgeo.sig.paris.fr/arcgis/rest/services/','CapGEO_FDP/Ortho_AERODATA_Ete2013','ESRI-WMS-Base']);
parameters.push(parameters['WMS-Layer1']=['2','Plan_Voirie','AGS-MPS','http://capgeo.sig.paris.fr/arcgis/rest/services/','CapGEO_FDP/FDP_CAPGEO_Plan_Voirie_externe',false,'ESRI-WMS-Layer']);
parameters.push(parameters['WMS-Layer2']=['4','Popup_WMS','AGS-MPS','http://xdir-infmpub-pr.ressources.paris.mdp/arcgis/rest/services/','DU/ADS_Gerco',true,'ESRI-WMS-Layer']);
parameters.push(parameters['WFS1']=['Lieu','AGS','http://capgeo.sig.paris.fr/arcgis/rest/services/capgeo_dasco/DASCO_Evenements_ecoles/FeatureServer/0','EPSG:2154','ARRONDISSEMENT = 4','ESRI-WFS']);
parameters.push(parameters['Popup2'] = ['HeatMap',['TITRE ','ARRONDISSEMENT','DESCRIPTIF']]);
parameters.push(parameters['Popup3'] = ['Arrondissements',['l_ar','c_arinsee']]);
parameters.push(parameters['WFS2']=['Mairie:arrondissements','GeoServer','http://localhost:8080/geoserver/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=Mairie:arrondissements','EPSG:4326','','GeoServer-WFS']);
parameters.push(parameters['WFS3']=['DPE_points_noirs','AGS','http://capgeo.sig.paris.fr/arcgis/rest/services/capgeo_dpe/DPE_points_noirs/FeatureServer/6','EPSG:2154','','ESRI-WFS']);
//parameters.push(parameters['WFS3']=['AGS','http://services.arcgis.com/rOo16HdIMeOBI4Mb/arcgis/rest/services/PDX_Pedestrian_Districts/FeatureServer/0','PDX_Pedestrian_Districts','','ESRI-WFS']);
parameters.push(parameters['WMTS1']=['Otrho_Paris_Tiled','AGS','http://capgeo.sig.paris.fr/arcgis/rest/services/CapGEO_FDP/Ortho_AERODATA_Ete2013/ImageServer','EPSG:2154',[305.7480844128355,152.874174498349,76.43695495724326,38.218609770552874,19.109040301413938,9.554387858775717,4.777061637456608,2.3883985267970536,1.1940669714672763,0.5969011938023876,0.2984505969011938,0.13229193125052918],[-35597500, 48953100],'ESRI-WMTS']);
parameters.push(parameters['GeoJSON1'] = ['Test','EPSG:4326','Lutece']);
parameters.push(parameters['HeatMap1'] = ['HeatMap','1','Lieu',false,'','10','25','20']);
parameters.push(parameters['ThematicSimple1'] = ['Arrondissements','4','Mairie:arrondissements',false, 'c_arinsee', 'mapStyle1', 'defaultStyle1']);
parameters.push(parameters['ThematicComplex1'] = ['Arrondissements_Ideation','5','Mairie:arrondissements',false, 'c_arinsee', 'c_arinsee', 'c_arinsee', 'mapStyle1', 'IdeationStyle', '0.0001']);
parameters.push(parameters['Cluster1'] = ['Souillure','3','DPE_points_noirs',false,'60','']);
parameters.push(parameters['Popup1'] = ['Test',['nom','prenom','type','link']]);
parameters.push(parameters['Popup4'] = ['Popup_WMS',['nom','prenom','type','link']]);
parameters.push(parameters['Popup_ShowLink'] = true);
fieldParameters.push(fieldParameters['TypeEdit']='');
fieldParameters.push(fieldParameters['GeomGeoJson']='GeomGeoJson');
fieldParameters.push(fieldParameters['GeomCentroidXStockage']='GeomCentroidXStockage');
fieldParameters.push(fieldParameters['GeomCentroidYStockage']='GeomCentroidYStockage');
fieldParameters.push(fieldParameters['GeomCentroidXGeocodage']='GeomCentroidXGeocodage');
fieldParameters.push(fieldParameters['GeomCentroidYGeocodage']='GeomCentroidYGeocodage');
fieldParameters.push(fieldParameters['GeomState']='GeomState');
fieldParameters.push(fieldParameters['UrlGeoJSON1']=['Test','http://localhost:8081/myapp/myresource']);
var GisMapDisplay = new GisMap(idMap);
GisMapDisplay.initGisMap(globalParameters, parameters, fieldParameters);
