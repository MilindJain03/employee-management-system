const EmployeeTable = ({ employees, onEdit, onDelete, visibleColumns = [] }) => {
  // Default columns if none provided
  const defaultColumns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'position', label: 'Position' },
  ];

  const columns = visibleColumns.length > 0 ? visibleColumns : defaultColumns;

  const renderCell = (employee, columnId) => {
    switch (columnId) {
      case 'name':
        return (
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-lg">
              {employee.name.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <div className="text-sm font-semibold text-gray-900">{employee.name}</div>
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {employee.email}
          </div>
        );
      case 'position':
        return (
          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gradient-to-r from-purple-100 to-blue-100 text-purple-800 shadow-sm">
            {employee.position}
          </span>
        );
      case 'id':
        return (
          <span className="text-sm font-mono text-gray-600">#{employee.id}</span>
        );
      case 'createdAt':
        return (
          <span className="text-sm text-gray-600">
            {new Date(employee.createdAt).toLocaleDateString()}
          </span>
        );
      case 'updatedAt':
        return (
          <span className="text-sm text-gray-600">
            {new Date(employee.updatedAt).toLocaleDateString()}
          </span>
        );
      default:
        return <span className="text-sm text-gray-600">{employee[columnId]}</span>;
    }
  };
  if (employees.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 mb-4">
          <svg
            className="h-10 w-10 text-purple-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No employees found</h3>
        <p className="mt-2 text-sm text-gray-600">Get started by creating your first employee.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gradient-to-r from-purple-50 to-blue-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-purple-900 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
            <th
              scope="col"
              className="px-6 py-4 text-right text-xs font-bold text-purple-900 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white/50 divide-y divide-gray-100">
          {employees.map((employee, index) => (
            <tr 
              key={employee.id} 
              className="hover:bg-purple-50/50 transition-all duration-200 hover:shadow-md animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {columns.map((column) => (
                <td key={column.id} className="px-6 py-5 whitespace-nowrap">
                  {renderCell(employee, column.id)}
                </td>
              ))}
              <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(employee)}
                  className="inline-flex items-center px-3 py-2 text-purple-600 hover:text-purple-900 hover:bg-purple-50 rounded-lg transition-all duration-200 mr-2 focus:outline-none focus:ring-2 focus:ring-purple-300"
                  aria-label={`Edit ${employee.name}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="font-medium">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(employee)}
                  className="inline-flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-300"
                  aria-label={`Delete ${employee.name}`}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="font-medium">Delete</span>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;
