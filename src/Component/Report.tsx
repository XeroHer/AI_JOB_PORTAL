import ContactPage from "./ContactPage";

const Report = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      
      <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-lg p-6">
        
        {/* Header */}
        <div className="mb-8 text-center">
        <h1 className="text-3xl font-semibold">Report an Issue 🐞</h1>
        <p className="text-gray-400 text-sm mt-2">
          Tell us what went wrong and we’ll fix it ASAP.
        </p>
      </div>

        {/* Form Section */}
        <div className="mt-4 ">
          <ContactPage  />
        </div>

      </div>

    </div>
  );
};

export default Report;