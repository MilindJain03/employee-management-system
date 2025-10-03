const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex justify-center items-center">
      <div
        className={`${sizeClasses[size]} border-purple-200 border-t-purple-600 rounded-full animate-spin`}
        style={{ borderTopColor: '#7c3aed' }}
      ></div>
    </div>
  );
};

export default Spinner;
