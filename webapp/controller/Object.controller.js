/*global location*/
sap.ui.define([
		"pise/mi/plm/bom/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History"
	], function(BaseController, JSONModel, History) {
	"use strict";

	return BaseController.extend("pise.mi.plm.bom.controller.Object", {

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		onInit: function() {
			// Model used to manipulate control states. The chosen values make sure,
			// detail page is busy indication immediately so there is no break in
			// between the busy indication for loading the view's meta data
			var iOriginalBusyDelay,
				oViewModel = new JSONModel({
					busy: true,
					delay: 0
				});

			this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			// Store original busy indicator delay, so it can be restored later on
			iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
			this.setModel(oViewModel, "objectView");
			this.getOwnerComponent().getModel().metadataLoaded().then(function() {
				// Restore original busy indicator delay for the object view
				oViewModel.setProperty("/delay", iOriginalBusyDelay);
			});
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("objectView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		/**
		 * Event handler  for navigating back.
		 * It checks if there is a history entry. If yes, history.go(-1) will happen.
		 * If not, it will replace the current entry of the browser history with the worklist route.
		 * @public
		 */
		onNavBack: function() {
			var oHistory = History.getInstance();
			var sPreviousHash = oHistory.getPreviousHash();

			if (sPreviousHash !== undefined) {
				// The history contains a previous entry
				history.go(-1);
			} else {
				// Otherwise we go backwards with a forward history
				var bReplace = true;
				this.getRouter().navTo("worklist", {}, bReplace);
			}
		},
		
		/**
		 * Event handler  for plus button press on timeline.
		 * Opens dialog.
		 * @public
		 */
		onCreateChangePress: function(oEvent) {
			if(!this._oNewChangeDialog){
				this._oNewChangeDialog = sap.ui.xmlfragment("pise.mi.plm.bom.view.fragment.CreateChangeNumber", this);
				
				this.getView().addDependent(this._oNewChangeDialog);
			}
			
			this._oNewChangeDialog.open();
		},
		
		/**
		 * Event handler timeline item press.
		 * Opens dialog.
		 * @public
		 */
		onChangeNumberPress: function(oEvent){
			// create popover
			if (!this._oPopover) {
				this._oPopover = sap.ui.xmlfragment("pise.mi.plm.bom.view.fragment.ChangeNumberDetails", this);
				this.getView().addDependent(this._oPopover);
				//this._oPopover.bindElement("/ProductCollection/0");
			}

			// delay because addDependent will do a async rerendering and the actionSheet will immediately close without it.
			var oItem = oEvent.getParameters().selectedItem;
			
			jQuery.sap.delayedCall(0, this, function () {
				this._oPopover.openBy(oItem);
			});
		},
		
		/**
		 * Event handler timeline item press.
		 * Opens dialog.
		 * @public
		 */
		onCloseCreateChangeNumberDialog: function(){
			this._oNewChangeDialog.close();
		},
		
		/**
		 * Event handler for attribute update press.
		 * Opens dialog.
		 * @public
		 */
		onAttrUpdatePress: function(){
			if(!this._oAttrUpdateDialog){
				this._oAttrUpdateDialog = sap.ui.xmlfragment("pise.mi.plm.bom.view.fragment.AttributesUpdate", this);
				
				this.getView().addDependent(this._oAttrUpdateDialog);
			}
			
			this._oAttrUpdateDialog.open();
		},
		
		/**
		 * Event handler for dialog close.
		 * Opens dialog.
		 * @public
		 */
		onCloseAttrributesUpdateDialog: function(){
			this._oAttrUpdateDialog.close();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
		 * @private
		 */
		_onObjectMatched: function(oEvent) {
			//"/BomHeaderSet(Matnr='Matnr 31',Werks='Werks 31',Stlty='Stlty 31',Stlan='Stlan 31',Stlal='Stlal 31',Stlnr='Stlnr 31')"
			var sObjectPath = "/BomHeaderSet(Matnr='" + 
				oEvent.getParameter("arguments").Matnr + "',Werks='" +
				oEvent.getParameter("arguments").Werks + "',Stlty='" +
				oEvent.getParameter("arguments").Stlty + "',Stlan='" +
				oEvent.getParameter("arguments").Stlan + "',Stlal='" +
				oEvent.getParameter("arguments").Stlal + "',Stlnr='" +
				oEvent.getParameter("arguments").Stlnr +
			"')";

			this._bindView(sObjectPath);
		},

		/**
		 * Binds the view to the object path.
		 * @function
		 * @param {string} sObjectPath path to the object to be bound
		 * @private
		 */
		_bindView: function(sObjectPath) {
			var oViewModel = this.getModel("objectView"),
				oDataModel = this.getModel();

			this.getView().bindElement({
				path: sObjectPath,
				events: {
					change: this._onBindingChange.bind(this),
					dataRequested: function() {
						oDataModel.metadataLoaded().then(function() {
							// Busy indicator on view should only be set if metadata is loaded,
							// otherwise there may be two busy indications next to each other on the
							// screen. This happens because route matched handler already calls '_bindView'
							// while metadata is loaded.
							oViewModel.setProperty("/busy", true);
						});
					},
					dataReceived: function() {
						oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange: function(oEvent) {
			var oView = this.getView(),
				oViewModel = this.getModel("objectView"),
				oElementBinding = oView.getElementBinding();

			// No data for the binding
			if (!oElementBinding.getBoundContext()) {
				this.getRouter().getTargets().display("objectNotFound");
				return;
			}

			var oResourceBundle = this.getResourceBundle(),
				oObject = oView.getBindingContext().getObject(),
				sObjectId = oObject.Matnr,
				sObjectName = oObject.Adatu;

			// Everything went fine.
			oViewModel.setProperty("/busy", false);
			oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
			oViewModel.setProperty("/shareOnJamTitle", sObjectName);
			oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
			oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
		}

	});

});