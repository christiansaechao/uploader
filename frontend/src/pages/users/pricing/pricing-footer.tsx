import React from "react";

export const PricingFooter = () => {
  return (
    <div className="bg-gray-50 rounded-2xl p-8 text-center">
      <h3 className="text-2xl font-bold text-gray-900 mb-4">
        Need a Custom Solution?
      </h3>
      <p className="text-gray-600 mb-6">
        Contact us for enterprise pricing and custom integrations tailored to
        your business needs.
      </p>
      <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
        Contact Sales
      </button>
    </div>
  );
};
