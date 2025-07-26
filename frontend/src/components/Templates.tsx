import React, { useState } from 'react';
import { Plus, Edit, Trash2, Copy, Search } from 'lucide-react';
import type { Template } from '../types';

interface TemplatesProps {
  templates: Template[];
}

export default function Templates({ 
  templates
}: TemplatesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(templates.map(t => t.category)))];
  
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Templates</h1>
          <p className="text-gray-600 mt-2">Create and manage listing templates for faster product uploads.</p>
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>New Template</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <div key={template.id} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Duplicate template"
                >
                  <Copy size={16} />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Edit template"
                >
                  <Edit size={16} />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete template"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Category</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-gray-700">{template.category}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Fields</span>
                <span className="text-gray-900 font-medium">{template.fields.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Usage</span>
                <span className="text-gray-900 font-medium">{template.usageCount} times</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Updated</span>
                <span className="text-gray-500">{new Date(template.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filters.' 
              : 'Create your first template to get started.'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Template
            </button>
          )}
        </div>
      )}
    </div>
  );
}