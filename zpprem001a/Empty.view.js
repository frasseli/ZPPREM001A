sap.ui.jsview("zpprem001a.Empty", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zpprem001a.Empty
	*/ 
	getControllerName : function() {
		return "zpprem001a.Empty";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zpprem001a.Empty
	*/ 
	createContent : function(oController) {
 		return new sap.m.Page({
			//title: "Empty page",
			content: [
			
			]
		});
	}

});