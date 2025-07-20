import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
} from 'lucide-react';
import useItemsStore from '../stores/itemsStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const BulkUpload = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [previewData, setPreviewData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResults, setUploadResults] = useState(null);
  const { createItem } = useItemsStore();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploadResults(null);

    // Parse CSV file
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload/csv', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to parse CSV file');
      }

      const data = await response.json();
      setPreviewData(data.items || []);
    } catch (error) {
      console.error('Error parsing CSV:', error);
      setPreviewData([]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!previewData.length) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Create items one by one to show progress
      const createdItems = [];
      for (let i = 0; i < previewData.length; i++) {
        const item = previewData[i];
        try {
          const createdItem = await createItem(item);
          createdItems.push({ ...createdItem, status: 'success' });
        } catch (error) {
          createdItems.push({ ...item, status: 'error', error: error.message });
        }

        setUploadProgress(((i + 1) / previewData.length) * 100);
      }

      setUploadResults({
        total: previewData.length,
        successful: createdItems.filter((item) => item.status === 'success')
          .length,
        failed: createdItems.filter((item) => item.status === 'error').length,
        items: createdItems,
      });

      // If all items were created successfully, also try bulk upload
      if (createdItems.every((item) => item.status === 'success')) {
        try {
          await fetch('/api/upload/bulk', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              items: createdItems.filter((item) => item.status === 'success'),
            }),
          });
        } catch (error) {
          console.error('Bulk upload failed:', error);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/upload/template', {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to download template');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bulk-upload-template.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
          <p className="text-gray-600">
            Upload multiple items at once using CSV files
          </p>
        </div>
        <Button onClick={downloadTemplate} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      <Card>
        <div className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary-600">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-sm text-gray-500">
                  Supports .csv, .xls, and .xlsx files
                </p>
              </div>
            )}
          </div>

          {uploadedFile && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <FileText className="w-4 h-4 mr-2" />
              {uploadedFile.name} ({Math.round(uploadedFile.size / 1024)} KB)
            </div>
          )}
        </div>
      </Card>

      {previewData.length > 0 && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                Preview ({previewData.length} items)
              </h3>
              <Button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Upload Items'}
              </Button>
            </div>

            {uploading && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Upload Progress</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {previewData.slice(0, 10).map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {uploadResults?.items?.[index]?.status === 'success' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : uploadResults?.items?.[index]?.status ===
                          'error' ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : (
                          'Pending'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {previewData.length > 10 && (
              <p className="text-sm text-gray-500 mt-4">
                Showing first 10 items of {previewData.length} total
              </p>
            )}
          </div>
        </Card>
      )}

      {uploadResults && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Upload Results</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {uploadResults.total}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploadResults.successful}
                </div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {uploadResults.failed}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default BulkUpload;
