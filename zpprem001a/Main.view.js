sap.ui.jsview("zpprem001a.Main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zpprem001a.Main
	*/ 
	getControllerName : function() {
		return "zpprem001a.Main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zpprem001a.Main
	*/ 
	createContent : function(oController) {
		
		//Split-App Control
		this.app = new sap.m.SplitApp({
			//Close the master view if branching to detail view
			afterDetailNavigate: function(){
				this.hideMaster();
			}
		});
		
		
		//Empty view as detail, at first
		this.app.addDetailPage(sap.ui.jsview("zpprem001a.Empty"));
		this.app.addDetailPage(sap.ui.xmlview("zpprem001a.OrderDetail"));

		//Order List view as Master
		this.app.addMasterPage(sap.ui.jsview("zpprem001a.OrderList", "zpprem001a.OrderList"));
		
		//Important: address the master pane last, because only one of the two sides is displayed in smartphones
		this.app.toDetail("zpprem001a.Empty");
		this.app.toMaster("zpprem001a.OrderList");

		//Return the SplitApp control as master page
		return this.app;	

	}

});