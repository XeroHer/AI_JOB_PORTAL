import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiPhone, FiLinkedin, FiGithub } from "react-icons/fi";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error();
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto p-8 bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
     <div className="mb-8 text-center">
  <h1 className="text-3xl font-semibold">Contact Us</h1>
  <p className="text-gray-400 text-sm mt-2">
    Have a question, feedback, or issue? We'd love to hear from you.
  </p>
</div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div>
          <label className="block text-sm mb-1 text-gray-300">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-300">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-300">Message</label>
          <textarea
            placeholder="Describe the issue..."
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 h-32 resize-none focus:ring-2 focus:ring-blue-500 outline-none transition"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full text-black bg-blue-600 hover:bg-blue-700 transition rounded-lg py-2 font-medium disabled:opacity-50"
        >
          {status === "sending" ? "Sending..." : "Submit Report"}
        </button>
      </form>

      {/* Status */}
      {status === "success" && (
        <p className="text-green-400 mt-4 text-center">
          ✅ Report sent successfully!
        </p>
      )}

      {status === "error" && (
        <p className="text-red-400 mt-4 text-center">
          ❌ Something went wrong. Try again.
        </p>
      )}

      {/* Footer Links */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-sm">
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-400">
          
          <a href="tel:+1234567890" className="flex items-center gap-2 hover:text-white">
            <FiPhone /> 7887780309
          </a>

          <a href="mailto:bksraut27@gmail.com" className="flex items-center gap-2 hover:text-white">
            <FiMail /> Email
          </a>

          <a
            href="https://www.linkedin.com/in/bikesh-kumar-raut-13bb4820b/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white"
          >
            <FiLinkedin /> LinkedIn
          </a>

          <a
            href="https://github.com/XeroHer"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white"
          >
            <FiGithub /> GitHub
          </a>

        </div>
      </div>
    </motion.div>
  );
};

export default ContactPage;