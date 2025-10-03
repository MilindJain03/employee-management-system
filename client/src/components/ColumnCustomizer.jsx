import { useState, useEffect } from 'react';

const ColumnCustomizer = ({ isOpen, onClose, availableColumns, visibleColumns, onSave }) => {
  const [visible, setVisible] = useState([]);
  const [available, setAvailable] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setVisible(visibleColumns);
      setAvailable(availableColumns.filter(col => !visibleColumns.find(v => v.id === col.id)));
    }
  }, [isOpen, availableColumns, visibleColumns]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const moveToVisible = (column) => {
    setAvailable(available.filter(col => col.id !== column.id));
    setVisible([...visible, column]);
  };

  const moveToAvailable = (column) => {
    // Don't allow removing the last column
    if (visible.length <= 1) return;
    
    setVisible(visible.filter(col => col.id !== column.id));
    setAvailable([...available, column]);
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const newVisible = [...visible];
    [newVisible[index - 1], newVisible[index]] = [newVisible[index], newVisible[index - 1]];
    setVisible(newVisible);
  };

  const moveDown = (index) => {
    if (index === visible.length - 1) return;
    const newVisible = [...visible];
    [newVisible[index], newVisible[index + 1]] = [newVisible[index + 1], newVisible[index]];
    setVisible(newVisible);
  };

  const handleSave = () => {
    onSave(visible);
    onClose();
  };

  const handleReset = () => {
    setVisible(availableColumns);
    setAvailable([]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full animate-scale-in overflow-hidden">
        {/* Header */}
        <div className="gradient-primary px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Customize Columns</h2>
                <p className="text-purple-100 text-sm mt-1">Select and reorder columns to display</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Available Columns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Available Columns</h3>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {available.length}
                </span>
              </div>
              <div className="border-2 border-gray-200 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-gray-50">
                {available.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                    <p className="text-sm">All columns are visible</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {available.map((column) => (
                      <div
                        key={column.id}
                        className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <span className="font-medium text-gray-700">{column.label}</span>
                        </div>
                        <button
                          onClick={() => moveToVisible(column)}
                          className="opacity-0 group-hover:opacity-100 px-3 py-1 text-sm text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-lg transition-all duration-200"
                        >
                          Add →
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visible Columns */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Visible Columns</h3>
                <span className="text-sm text-white bg-gradient-to-r from-purple-500 to-blue-500 px-2 py-1 rounded-full">
                  {visible.length}
                </span>
              </div>
              <div className="border-2 border-purple-200 rounded-xl p-4 min-h-[300px] max-h-[400px] overflow-y-auto bg-purple-50/30">
                {visible.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-sm">No columns selected</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visible.map((column, index) => (
                      <div
                        key={column.id}
                        className="flex items-center justify-between p-3 bg-white border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all duration-200 group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {index + 1}
                          </div>
                          <span className="font-medium text-gray-700">{column.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => moveUp(index)}
                            disabled={index === 0}
                            className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                            title="Move up"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveDown(index)}
                            disabled={index === visible.length - 1}
                            className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                            title="Move down"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveToAvailable(column)}
                            disabled={visible.length <= 1}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 ml-2"
                            title="Remove"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {visible.length <= 1 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-yellow-800">At least one column must be visible in the table.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-between items-center">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-all duration-200 font-medium"
          >
            Reset to Default
          </button>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 text-white gradient-primary rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColumnCustomizer;
