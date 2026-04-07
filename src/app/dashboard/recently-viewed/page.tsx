export default function RecentlyViewedPage() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-h-[400px]">
      <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-6">Recently Viewed</h1>
      <div className="flex flex-col items-center justify-center h-64 text-center">
         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
         </div>
         <h2 className="text-lg font-medium text-gray-900">No recently viewed items</h2>
         <p className="text-gray-500 mt-2 max-w-sm">Items you view will appear here so you can easily find them later.</p>
      </div>
    </div>
  );
}
