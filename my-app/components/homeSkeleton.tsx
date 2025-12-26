export default function HomeSkeleton() {
  return (
    <div className="w-full max-w-xl p-6 space-y-4 animate-pulse">
      <div className="h-10 bg-gray-300 rounded w-2/3 mx-auto" />
      <div className="h-12 bg-gray-200 rounded" />
      <div className="h-12 bg-gray-200 rounded" />
    </div>
  );
}
