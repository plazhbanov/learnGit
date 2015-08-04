sap.ui.define([
		"pise/mi/plm/bom/controller/BaseController"
	], function(BaseController) {
	"use strict";

	return BaseController.extend("pise.mi.plm.bom.controller.NotFound", {

		/**
		 * Navigates to the worklist when the link is pressed
		 * @public
		 */
		onLinkPressed: function() {
			this.getRouter().navTo("worklist");
		}

	});

});