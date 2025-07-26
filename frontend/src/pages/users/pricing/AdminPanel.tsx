import React from "react";
import { Check } from "lucide-react";
import { useAdmin } from "../../hooks/useAdmin";
const AdminPanel = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Access Denied
        </h1>
        <p className="text-gray-600">
          You do not have administrative access to this panel.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Access</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          You have administrative access to all features. No subscription
          required.
        </p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 mb-2">
          Full Access Granted
        </h3>
        <p className="text-green-700 mb-4">
          As an administrator, you have unlimited access to all platform
          features including:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">
                Unlimited stores and listings
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">
                All marketplace integrations
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Advanced analytics</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">AI-powered tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Priority support</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-green-600" />
              <span className="text-green-800">Admin panel access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
