const backendSDK = require("../amazonPay/PWAINBackendSDK");

var config = {
  merchant_id: "AZ4WQCLDT2DF0",
  access_key: "AKIAJAKG6LME27HVCD3A",
  secret_key: "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",
  base_url: "amazonpay.amazon.in",
};
var client = new backendSDK(config);

var requestParameters = {};
requestParameters["sellerOrderId"] = "12121";
requestParameters["orderTotalAmount"] = "700";
requestParameters["orderTotalCurrencyCode"] = "INR";
requestParameters["transactionTimeout"] = "900";

var returnUrl = "https://YOUR_THANKYOU_PAGE_URL";
var amazonPayPaymentUrl = client.getProcessPaymentUrl(
  requestParameters,
  returnUrl
);

module.exports = [
  {
    method: "GET",
    path: "/",
    handler: async () => {
      return "Home Page";
    },
  },
  {
    method: "GET",
    path: "/pay",
    handler: async (request, h) => {
      return h.redirect("https://" + amazonPayPaymentUrl);
    },
  },
  {
    method: "GET",
    path: "/verifySignature",
    handler: async (request) => {
      var responseMap = {};
      for (let propName in requestParameters) {
        responseMap[propName] = requestParameters[propName];
      }
      const response = client.verifySignature(responseMap);
      return response;
    },
  },
  {
    method: "GET",
    path: "/listOrderRef",
    handler: async () => {
      let res = "Ok";
      const days7Back = new Date(
        new Date().getTime() - 7 * 24 * 60 * 60 * 1000
      );
      const days7Forward = new Date(
        new Date().getTime() + 7 * 24 * 60 * 60 * 1000
      );
      var requestParameters = {};
      requestParameters["queryId"] = "12121";
      requestParameters["startTime"] = days7Back.toISOString();
      requestParameters["endTime"] = days7Forward.toISOString();

      client.listOrderReference(requestParameters, (response) => {
        console.log(response);
        res = JSON.stringify(response);
      });
      return "Ok";
    },
  },
];
