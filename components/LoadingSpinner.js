export default function LoadingSpinner({ size = 'default', color = 'blue' }) {
  const sizes = {
    small: 'h-4 w-4',
    default: 'h-5 w-5',
    large: 'h-6 w-6'
  };

  const colors = {
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    gray: 'border-gray-600'
  };

  return (
    <div className={`animate-spin rounded-full ${sizes[size]} border-b-2 ${colors[color]}`}></div>
  );
}
