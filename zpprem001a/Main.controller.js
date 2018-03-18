sap.ui.controller("zpprem001a.Main", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zpprem001a.Main
*/
	onInit: function() {

		
		//Initialize the EventBus
		
		//Remember "this" reference
		var that = this;
		
		this.oEventBus = sap.ui.getCore().getEventBus();
		this.oEventBus.subscribe("nav", "to", this.navTo, this);
		this.oEventBus.subscribe("nav", "back", this.navBack, this);
		this.oEventBus.subscribe(
				"app",
				"mode",
				function(sChannelId, sEventId, oData){
					this.getView().app.setMode(oData.mode);
				}, this);
		
		jQuery.sap.require("jquery.sap.history");
		jQuery.sap.history({
			routes: [{
				path: "page",
				handler: function(params, navType){
					if(!params || !params.id){
						jQuery.sap.log.error("Invalid parameter: " + params);
					} else {
						that.oEventBus.publish("nav", "to", {
							viewId: params.id,
							navType: navType
						});
					}
				}
			}],
			defaultHandler: function(navType) {
				that.oEventBus.publish("nav", "to", {
					viewId: "zpprem001a.OrderList",
					navType: navType
				});
			}
		});

		//Create an Application Context to store global data
		sap.ui.getCore().AppContext = new Object();

		//Create the Model to Load Data from NW Gateway OData service
		var sServiceUrl = "/sap/opu/odata/SAP/ZPPREM001_SRV/";
		sap.ui.getCore().AppContext.oModel = new sap.ui.model.odata.ODataModel(sServiceUrl);

		//Bind the model to Core
		sap.ui.getCore().setModel(sap.ui.getCore().AppContext.oModel);
		
		//Create the resource bundle model for the translatable texts
		var sLangu = sap.ui.getCore().getConfiguration().getLanguage();
		console.log("The language is: " + sLangu);
		
		if(!sLangu){
			sLangu = "en";
		}

		this.oLangu = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "translations/translation.properties", "bundleLocale":sLangu});
		sap.ui.getCore().setModel(this.oLangu, "i18n");

		//Get reference to the i18n model in the app context
		sap.ui.getCore().AppContext.i18n = sap.ui.getCore().getModel("i18n").getResourceBundle();
		
		//Create a NumberFormat to display the quant fields
		jQuery.sap.require("sap.ui.core.format.NumberFormat");
		sap.ui.getCore().AppContext.oNumberFormat = sap.ui.core.format.NumberFormat.getFloatInstance({
			decimals: 3,
			minFractionDigits: 3,
			maxFractionDigits: 3,
			groupingEnabled: true,
			groupingSeparator: ".",
			decimalSeparator: ","
		});

	},

	//Handles the back navigation
	navBack: function(sChannelId, sEventId, oData){
		jQuery.sap.history.back();
	},
	
	//Handles the forward navigation through the functionality of SplitApp control
	navTo: function(sChannelId, sEventId, oData){
		
		var app = this.getView().app,
			sViewName = oData.viewName,
			sViewId = oData.viewId,
			oDataObject = oData.data,
			sNavType = oData.navType,
			oView;
		
		if(!sViewId){
			sViewId = sViewName;
		}
		
		var bMaster = (sViewId == "zpprem001a.OrderList");
		
		if(sNavType === jQuery.sap.history.NavType.Back){
			if(bMaster){
				app.backMaster();
			}
		} else {
			if(!sap.ui.getCore().byId(sViewId)){
				if(bMaster){
					oView = sap.ui.jsview(sViewId, sViewName);
					app.addMasterPage(oView)
				} else {
					oView = sap.ui.xmlview(sViewId, sViewName);
					app.addDetailPage(oView);
				}
			}
		}
			
		if(bMaster){
			app.toMaster(sViewId, oDataObject);
		} else {
			app.toDetail(sViewId, oDataObject);
		}

		//Write history entry
		if(!sNavType && (!bMaster || jQuery.device.is.phone)){
			jQuery.sap.history.addHistory("page", {id: sViewId}, false);
		}
				
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zpprem001a.Main
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zpprem001a.Main
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zpprem001a.Main
*/
//	onExit: function() {
//
//	}

});