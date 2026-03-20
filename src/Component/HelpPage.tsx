const HelpPage = () => {
  return (
    <div className="w-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gray-900 text-white px-6 py-6">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <img src="/WhatsApp Image 2026-03-13 at 15.22.44.png" className="h-6" />
          JobAI Help Center
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-10 max-w-5xl mx-auto space-y-10">

        {/* Job Seeker Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">For Job Seekers</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>How to create an account</li>
            <li>How to build and update your profile & CV</li>
            <li>How to apply for jobs</li>
            <li>How to track your applications</li>
            <li>Set up job alerts and notifications</li>
          </ul>
        </section>

        {/* Employer Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">For Employers</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>How to post a job</li>
            <li>Manage and edit job listings</li>
            <li>Search and filter candidates</li>
            <li>Pricing plans and payment help</li>
          </ul>
        </section>

        {/* FAQs Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">FAQs</h2>
          <div className="space-y-4">
            <details className="bg-white p-4 rounded shadow">
              <summary className="font-medium cursor-pointer">How do I reset my password?</summary>
              <p className="mt-2 text-gray-700">
                Click on “Forgot Password” on the login page and follow the instructions to reset your password.
              </p>
            </details>
            <details className="bg-white p-4 rounded shadow">
              <summary className="font-medium cursor-pointer">How do I post a job?</summary>
              <p className="mt-2 text-gray-700">
                Go to your dashboard, click “Post a Job”, fill in the details, and submit.
              </p>
            </details>
            <details className="bg-white p-4 rounded shadow">
              <summary className="font-medium cursor-pointer">How can I contact support?</summary>
              <p className="mt-2 text-gray-700">
                Use the Contact section below or email bksraut27@gmail.com.
              </p>
            </details>
          </div>
        </section>

        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
          <p className="text-gray-700 mb-4">
            If you cannot find an answer here, reach out to our support team:
          </p>
          <a 
  href="/contact"
  className="inline-block bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition"
>
  Email Support
</a>
        </section>
      </main>
    </div>
  );
};

export default HelpPage;