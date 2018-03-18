sap.ui.controller("zpprem001a.OrderList", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zpprem001a.OrderList
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zpprem001a.OrderList
*/
	onBeforeRendering: function() {

		//Reset the selection
		var oOrderList = sap.ui.getCore().byId("orderList");
		oOrderList.removeSelections();

	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zpprem001a.OrderList
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zpprem001a.OrderList
*/
//	onExit: function() {
//
//	}

/**
 * Transfer the data for the detail view via the binding context 
 */
	onBeforeFirstShow: function(oEvent){
		this.bindListData();
	},

/**
 * Factory function to bind the data to the list control in the inbox view
 */	
	bindListData: function(aFilters){
		//Remember "this" context
		var that = this;
		
		//Create the template for the List
		var oItemTemplate = new sap.m.StandardListItem();
		oItemTemplate.setModel(this.getModel);
		
		//Binding to the list
		this.getView().oList.bindAggregation("items", {
			path: "/PLHTSet",
			factory: function(sId){
				return new sap.m.ObjectListItem(sId, {
					//icon: "sap-icon://machine",
					title: "{Matnr}",
					intro: "{Ktext}",
					number: "{Gsmngf}",
					numberUnit: "{Meins}",
					type: jQuery.device.is.phone? sap.m.ListType.Navigation : sap.m.ListType.None,
					tap: [that.onListItemTap, that]
				});	
			},
			
			filters: aFilters
		});
		
		//console.log("bindListData() foi executado");
	},
	
/**
 * Event to fire the display of the details in the detail view on Desktop
 * @param oEvent
 */
	onListSelect: function(oEvent){
		
		var oBindingContext = oEvent.getParameter("listItem").getBindingContext();
		
		sViewId = "detailConfirm_" + oBindingContext.getProperty("Plnum");
		
		//Transfer the event to EventBus
		sap.ui.getCore().getEventBus().publish("nav", "to", {
			viewName: "zpprem001a.OrderDetail", 
			viewId: sViewId,
			data: {
				bindingContext: oBindingContext
			}
		});
	},
	
/**
 * Event to fire the display of the details in the detail view on Mobile devices
 * @param oEvent
 */
	onListItemTap: function(oEvent){
		
		var oBindingContext = oEvent.oSource.getBindingContext();
		
		sViewId = "detailConfirm_" + oBindingContext.getProperty("Plnum");
		
		//Transfer the event to EventBus
		sap.ui.getCore().getEventBus.publish("nav", "to", {
			viewName: "zpprem001a.OrderDetail", 
			viewId: sViewId,
			data: {
				bindingContext: oBindingContext
			}
		});		
	},
	
	/**
	 * Handles the back navigation
	 */
	onNavButtonPress: function(){
		sap.ui.getCore().getEventBus().publish("nav", "back");
	}
	
});