sap.ui.define([
		"sap/ui/test/Opa5"
	], function(Opa5) {
	"use strict";

	function getFrameUrl(sHash, sUrlParameters) {
		var sUrl = jQuery.sap.getResourcePath("pise/mi/plm/bom/app", ".html");
		sUrlParameters = sUrlParameters ? "?" + sUrlParameters : "";

		if (sHash) {
			sHash = "#pisemiplmbom-display&/" + (sHash.indexOf("/") === 0 ? sHash.substring(1) : sHash);
		} else {
			sHash = "#pisemiplmbom-display";
		}

		return sUrl + sUrlParameters + sHash;
	}

	return Opa5.extend("pise.mi.plm.bom.test.integration.pages.Common", {

		iStartMyApp: function(oOptions) {
			var sUrlParameters = "";
			oOptions = oOptions || {};

			if (oOptions.delay) {
				sUrlParameters = "serverDelay=" + oOptions.delay;
			}

			this.iStartMyAppInAFrame(getFrameUrl(oOptions.hash, sUrlParameters));
		},

		iLookAtTheScreen: function() {
			return this;
		},

		iStartMyAppOnADesktopToTestErrorHandler: function(sParam) {
			this.iStartMyAppInAFrame(getFrameUrl("", sParam));
		}

	});

});