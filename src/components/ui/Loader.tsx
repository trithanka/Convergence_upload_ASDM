const Loader = () => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-sm w-full mx-4">
          <div className="flex justify-center mb-8">
            <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Loading Your Content</h2>
          <p className="text-gray-600 text-center mb-8">Please wait while we prepare your experience...</p>
          {/* <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div style={{ width: "30%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
            </div>
          </div> */}
          <div className="text-center text-sm text-gray-500">
            This may take a few moments
          </div>
        </div>
      </div>
    )
  }
  
  export default Loader