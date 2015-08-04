jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
jQuery.sap.require("sap.ui.test.opaQunit");
jQuery.sap.require("sap.ui.test.Opa5");

jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.Common");
jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.Worklist");
jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.Object");
jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.NotFound");
jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.Browser");
jQuery.sap.require("pise.mi.plm.bom.test.integration.pages.App");

sap.ui.test.Opa5.extendConfig({
	arrangements: new pise.mi.plm.bom.test.integration.pages.Common(),
	viewNamespace: "pise.mi.plm.bom.view."
});

// Start the tests
jQuery.sap.require("pise.mi.plm.bom.test.integration.WorklistJourney");
jQuery.sap.require("pise.mi.plm.bom.test.integration.ObjectJourney");
jQuery.sap.require("pise.mi.plm.bom.test.integration.NavigationJourney");
jQuery.sap.require("pise.mi.plm.bom.test.integration.NotFoundJourney");
jQuery.sap.require("pise.mi.plm.bom.test.integration.FLPIntegrationJourney");