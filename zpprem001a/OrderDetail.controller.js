sap.ui.controller("zpprem001a.OrderDetail", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf zpprem001a.OrderDetail
*/
	onInit: function() {
		
		this.getView().addEventDelegate({
			onBeforeFirstShow: function(oEvent) {
				this.bindFormData(oEvent);
			}.bind(this)
		});
		
		this._appContext = sap.ui.getCore().AppContext;
	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf zpprem001a.OrderDetail
*/
//	onBeforeRendering: function() {
//
//	},

/**
 * Transfer the data for the detail view via the binding context 
 */
//	onBeforeFirstShow: function(oEvent){
//		this.bindFormData(oEvent);
//	},
	
/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf zpprem001a.OrderDetail
*/
//	onAfterRendering: function() {
//
//	},

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf zpprem001a.OrderDetail
*/
//	onExit: function() {
//
//	}

	
/**
 * Bind the data found in the back end to the Form in the Details View
 */	
	bindFormData: function(oEvent){
		
		var sPlnum = oEvent.data.bindingContext.getProperty("Plnum");
		this.getView().setBindingContext(oEvent.data.bindingContext);
		this.getView().bindElement("/PLCSSet('"+sPlnum+"')");
		
		//Store the Order number in the application context
		this._appContext.sPlnum = sPlnum;
		
		//Initialize the confirmation fields
		var dToday = new Date();
		var sDay   = this.padNumber(dToday.getDate(), 2);
		var sMonth = this.padNumber(dToday.getMonth()+1, 2);
		var sYear  = dToday.getFullYear();
		this.getView().byId("confirmedDate").setValue(sYear + sMonth + sDay);
				
		var sQuantity = this.getView().byId("plannedQuantity").getValue();
		var fQuantity = this._appContext.oNumberFormat.parse(sQuantity);
		this.getView().byId("confirmedQuantity").setValue(this._appContext.oNumberFormat.format(fQuantity));
	},

/**
 * Validate the contents of the numeric field to only accepts numbers
 * @param oEvent
 * @returns
 */
	onLiveChange: function(oEvent){
	    var newValue = oEvent.getParameter("newValue");
        this.getView().byId("confirmedQuantity").setValueState(sap.ui.core.ValueState.None);
        if(isNaN(this._appContext.oNumberFormat.parse(newValue))){
        	this.getView().byId("confirmedQuantity").setValueState(sap.ui.core.ValueState.Error);
        } 
	},	
	
/**
 * Press event for the Confirm button
 */	
	onConfirm : function(){
		
		var bCompact = !!this.getView().$().closest(".sapUiSizeCompact").length;

		//Remember the current view reference
		var oView = this.getView();
		
		jQuery.sap.require("sap.m.MessageBox");
		
		//Get the data to confirm order from the view
		this._appContext.confirmedQuant = oView.byId("confirmedQuantity").getValue();
		this._appContext.confirmedDate = oView.byId("confirmedDate").getValue();
		this._appContext.confirmedText = oView.byId("confirmedText").getValue();
		this._appContext.maxQuantity = oView.byId("maxQuantity").getValue();
				
		//Validate the quantity entered
		var fCQuant = this._appContext.oNumberFormat.parse(this._appContext.confirmedQuant);
		var fMQuant = this._appContext.oNumberFormat.parse(this._appContext.maxQuantity);
		
		//Validate the format
		if(isNaN(this._appContext.oNumberFormat.parse(this._appContext.confirmedQuant))){
			sap.m.MessageBox.error(this._appContext.i18n.getText("QUANT_FORMAT_MESSAGE"), { } );
			return;
		}	
		
		//Validate the actual number against the maximum permitted
		if(fCQuant > fMQuant){
			sap.m.MessageBox.error(this._appContext.i18n.getText("QUANT_ERROR_MESSAGE"), { } );
			return;
		}
		
		//Build the message of the confirmation dialog
		var sConfirmMessage = this._appContext.i18n.getText("CONFIRM_MESSAGE") + " '" + this._appContext.sPlnum + "'?";
		
		//Remember the reference to the controller, because is about to enter in a new context
		var that = this;
		
		sap.m.MessageBox.confirm(
				sConfirmMessage, {
				styleClass: bCompact? "sapUiSizeCompact" : "",
				onClose: function(oAction){
					if(oAction==sap.m.MessageBox.Action.OK){
						
						//Create a loading indicator for the async call
						if(!that._appContext.dataLoaderBusyIndicator){
							that._appContext.dataLoaderBusyIndicator = new sap.m.BusyDialog("dataLoaderBusyIndicator", {
                                showCancelButton: false,
                                title: "{i18n>WAITING}",
                                text: "{i18n>WAITING_CONFIRMATION}" });
						}
						that._appContext.dataLoaderBusyIndicator.open();
						
						//Confirm the Order using the OData operation
						that._appContext.oModel.read(
								"/CRTSSet(Bfqtyf='" + that._appContext.confirmedQuant + 
								"',Budat='" + that._appContext.confirmedDate + 
								"',Bktxt='" + that._appContext.confirmedText +
								"',Plnum='" + that._appContext.sPlnum + "')", null, [], true,
								
								//the operation was successful
								function(oData, oResponse){
									if(oData.Confirmation && oData.Confirmation !== "0000000000"){
										var sReturnMessage = that._appContext.i18n.getText("RETURN_MESSAGE_SUCCESS");
										sReturnMessage = sReturnMessage.replace("&", oData.Confirmation);
										sap.m.MessageBox.information(sReturnMessage, { }, 
												function(oAction){
													//sap.ui.getCore().getEventBus().publish("nav", "back");
												});
										//Refreshes the Model
										that._appContext.oModel.refresh();
										that._appContext.dataLoaderBusyIndicator.close();

										//Set the Order status
										var oStatus = oView.byId("orderStatus");
										oStatus.setText(sReturnMessage);
										
									} else {
										//Refreshes the Model
										that._appContext.oModel.refresh();
										that._appContext.dataLoaderBusyIndicator.close();										
										sap.m.MessageBox.information(oData.Message, { } );
									}									
								},
								
								//an error occurred
								function(oError){
									that._appContext.dataLoaderBusyIndicator.close();
									sap.m.MessageBox.error(oError, { } );
								});
					}
				}
			}
		);
	},
	
/**
 * Press event for the Cancel button
 */	
	onCancel : function(){
		sap.ui.getCore().getEventBus().publish("nav", "back");
	},

/**
 * Handles the back navigation
 */
	onNavButtonPress: function(){
		sap.ui.getCore().getEventBus().publish("nav", "back");
	},
	
/**
 * Utility for padding numbers with leading Zero's
 * @param num the number
 * @param size the size of the desired string with zero's (limmited to 10 zero's)
 * @returns the string with leading zero's
 */
	padNumber: function(num, size) {
	    var s = "000000000" + num;
	    return s.substr(s.length-size);
	}
	
});