// MultiStepApplyForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MultiStepApplyForm = ({ jobId, onClose }) => {
  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    email: "",
    resume: null,
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const steps = [
    {
      label: "Full Name",
      field: "name",
      type: "text",
      placeholder: "Enter your full name",
      required: true,
    },
    {
      label: "Email",
      field: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
    },
    {
      label: "Resume",
      field: "resume",
      type: "file",
      accept: ".pdf,.doc,.docx",
      required: true,
    },
    {
      label: "Message (optional)",
      field: "message",
      type: "textarea",
      placeholder: "Optional message",
      required: false,
    },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateStep = () => {
    const currentStep = steps[step];
    let valid = true;
    let newErrors = {};

    if (currentStep.required && !form[currentStep.field]) {
      newErrors[currentStep.field] = `${currentStep.label} is required`;
      valid = false;
    }

    if (currentStep.field === "email" && form.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(form.email)) {
        newErrors.email = "Invalid email address";
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (!validateStep()) return;
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    Object.keys(form).forEach((key) => {
      if (form[key]) {
        formData.append(key, form[key]);
      }
    });

    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/api/jobs/jobs/${jobId}/apply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit application");
      }

      alert("Application submitted successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.message || "Error submitting application");
    } finally {
      setLoading(false);
    }
  };

  const current = steps[step];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-md mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      <h3 className="text-xl font-semibold">{current.label}</h3>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.field}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          {current.type === "textarea" ? (
            <textarea
              name={current.field}
              value={form[current.field]}
              onChange={handleChange}
              placeholder={current.placeholder}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          ) : current.type === "file" ? (
            <input
              type="file"
              name={current.field}
              onChange={handleChange}
              accept={current.accept}
              className="w-full"
            />
          ) : (
            <input
              type={current.type}
              name={current.field}
              value={form[current.field]}
              onChange={handleChange}
              placeholder={current.placeholder}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          )}

          {errors[current.field] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[current.field]}
            </p>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 rounded-md"
          >
            Back
          </button>
        ) : (
          <div></div>
        )}

        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={`px-4 py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-green-600"
            }`}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MultiStepApplyForm;