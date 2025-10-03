import { useState, useEffect } from 'react';

const EmployeeForm = ({ initialValues = {}, onSubmit, onCancel, mode = 'create' }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || '',
        email: initialValues.email || '',
        position: initialValues.position || '',
      });
    }
  }, [initialValues]);

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        if (!value.trim()) return 'Name is required';
        if (value.length > 100) return 'Name must be at most 100 characters';
        return '';
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email must be valid';
        if (value.length > 255) return 'Email must be at most 255 characters';
        return '';
      case 'position':
        if (!value.trim()) return 'Position is required';
        if (value.length > 50) return 'Position must be at most 50 characters';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      // Handle API errors
      if (error.data && error.data.errors) {
        const apiErrors = {};
        error.data.errors.forEach(err => {
          apiErrors[err.field] = err.message;
        });
        setErrors(apiErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
          }`}
          disabled={isSubmitting}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
          }`}
          disabled={isSubmitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="mt-1 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
          Position <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="position"
          name="position"
          value={formData.position}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 transition-all duration-200 ${
            errors.position ? 'border-red-500 focus:ring-red-200' : 'border-gray-200 focus:ring-purple-200 focus:border-purple-400'
          }`}
          disabled={isSubmitting}
          aria-invalid={!!errors.position}
          aria-describedby={errors.position ? 'position-error' : undefined}
        />
        {errors.position && (
          <p id="position-error" className="mt-1 text-sm text-red-600">
            {errors.position}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 text-white gradient-primary rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-purple-300 font-semibold"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </span>
          ) : (
            mode === 'create' ? 'Create Employee' : 'Update Employee'
          )}
        </button>
      </div>
    </form>
  );
};

export default EmployeeForm;
