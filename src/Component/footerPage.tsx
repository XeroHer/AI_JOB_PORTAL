import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

const FooterPage = () => {
  return (
    <footer className="bg-gray-900 text-white px-6 py-6 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 font-semibold text-lg">
            <img src="/WhatsApp Image 2026-03-13 at 15.22.44.png" className="h-6" alt="JobAI Logo" />
            JobAI
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Find your dream job with AI-powered matching
          </p>
          <ul className="text-gray-400 text-sm mt-2 list-disc list-inside">
            <li>Find Jobs or Candidates</li>
            <li>Apply or Hire</li>
          </ul>
        </div>

        {/* Company */}
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold text-white mb-1">Company</p>
          <a
            href="/about"
            className="text-gray-400 hover:text-white transition"
          >
            About
          </a>
          <a
            href="/career"
            className="text-gray-400 hover:text-white transition"
          >
            Careers
          </a>
          <a href="/jobs" className="text-gray-400 hover:text-white transition">
            Jobs
          </a>
        </div>

        {/* Support */}
        <div className="flex flex-col gap-1 text-sm">
          <p className="font-semibold text-white mb-1">Support</p>
          <a href="/help" className="text-gray-400 hover:text-white transition">
            Help Center
          </a>
          <a href="/help" className="text-gray-400 hover:text-white transition">
            FAQs
          </a>
          <a
            href="/contact"
            className="text-gray-400 hover:text-white transition"
          >
            Contact
          </a>
          <a
            href="/report"
            className="text-gray-400 hover:text-white transition"
          >
            Report Issue
          </a>
        </div>

        {/* Legal + Social */}
        <div className="flex flex-col gap-3 text-sm">
          <div>
            <p className="font-semibold text-white mb-1">Legal</p>
            <a
              href="/privacy"
              className="block text-gray-400 hover:text-white transition"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="block text-gray-400 hover:text-white transition"
            >
              Terms
            </a>
          </div>

          <div className="flex gap-4 text-xl mt-2">
  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/bikesh-kumar-raut-13bb4820b/"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-blue-400"
  >
    <FiLinkedin />
  </a>

  {/* GitHub */}
  <a
    href="https://github.com/XeroHer"
    target="_blank"
    rel="noopener noreferrer"
    className="hover:text-gray-400"
  >
    <FiGithub />
  </a>

  {/* Email */}
  <a
    href="mailto:bksraut27@gmail.com"
    className="hover:text-red-400"
  >
    <FiMail />
  </a>
</div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6 pt-3 flex flex-col md:flex-row justify-between text-xs text-gray-400 gap-2 md:gap-0">
        <span>© 2026 JobAI</span>
        <div className="flex gap-4">
          <a href="/jobs" className="hover:text-white transition">
            Find Jobs
          </a>
          <p className="hover:text-white transition">
            Post a Job via dashboard
          </p>
          <a href="/help" className="hover:text-white transition">
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default FooterPage;
