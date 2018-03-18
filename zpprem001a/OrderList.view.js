sap.ui.jsview("zpprem001a.OrderList", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zpprem001a.OrderList
	*/ 
	getControllerName : function() {
		return "zpprem001a.OrderList";
	},
	
	/**
	 * Initialization logic
	 * @param oEvent
	 */
	onBeforeFirstShow : function(oEvent){
		this.getController().onBeforeFirstShow(oEvent);
	},	
	

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zpprem001a.OrderList
	*/ 
	createContent : function(oController) {
		
		//Creates the list control for the Production Orders
		this.oList = new sap.m.List("orderList", {
			mode: jQuery.device.is.phone ? sap.m.ListMode.None : sap.m.ListMode.SingleSelectMaster,
			select: [oController.onListSelect, oController]
		});
		
		//Add list control to Page
		this.page = new sap.m.Page({
			title: "{i18n>PLO_TITLE}",
			navButtonTap: [oController.onNavButtonTap, oController],
			content: [this.oList]
		});
		
		return this.page;
	
	}

});