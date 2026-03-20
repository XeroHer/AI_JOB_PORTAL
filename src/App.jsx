import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./Auth/loginPage";
import { RegisterPage } from "./Auth/RegisterPage";
import HomePage from "./HomePage/Homepage";
import JobSeekerDashboard from "./JobSeeker/Dashboard";
import ProfilePage from "./JobSeeker/Profile/profile";

import RecruiterDashboard from "./Recruiter/Recruiter";

import Analyzer from "./JobSeeker/ResumeAnalyzer";
import JobPage from "./HomePage/JobPage";
import PostJob from "./Recruiter/PostJob";
import JobDetails from "./HomePage/JobDetails";
import { VerifyOtpPage } from "./Auth/veifyOTP";
import MultiStepApplyForm from "./HomePage/apply";
import ApplicantsPage from "./Recruiter/Applicant";
import RecruiterJobs from "./Recruiter/RecuiterJob";
import { ProtectedRoute } from "../proctedRoute/protected";
import Applications from "./JobSeeker/applicantionPage";
import RecommendedJobsPage from "./HomePage/AIRecommendation";
import EditJobForm from "./Recruiter/EditForm";
import AboutPage from "./Component/AboutPAge";
import ContactPage from "./Component/ContactPage";
import ForgotPasswordFlow from "./forgot/ForgotPasswordFlow";
import WrapJobPage from "./Wrap/JobPage";
import HelpPage from "./Component/HelpPage";
import CareersPage from "./Component/CareerPage";
import Report from "./Component/Report";


function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify-otp" element={<VerifyOtpPage />} />
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/jobs" element={<JobPage />} /> */}
        <Route path="/jobs" element={<WrapJobPage />} />
        <Route path="/jobs/:id" element={<JobDetails />} />
        <Route path="/report" element={<Report/>}/>

        {/* FooterLink */}
        <Route path="/help" element={<HelpPage />} />
        <Route path="/career" element={<CareersPage/>}/>

        <Route path="/apply" element={<MultiStepApplyForm />} />

        {/* Jobseeker Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="jobseeker">
              <JobSeekerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Jobseeker Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute role="jobseeker">
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
  path="/profile1"
  element={
    <ProtectedRoute role="recruiter">
      <ProfilePage />
    </ProtectedRoute>
  }
/>

        

        {/* Recruiter Dashboard */}
        <Route
          path="/recuiter"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterDashboard />
            </ProtectedRoute>
          }
        />

        {/* Recruiter Pages */}
        <Route
          path="/post"
          element={
            <ProtectedRoute role="recruiter">
              <PostJob />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recuiter/jobs"
          element={
            <ProtectedRoute role="recruiter">
              <RecruiterJobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recruiter/jobs/edit/:id"
          element={
            <ProtectedRoute role="recruiter">
              <EditJobForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recruiter/applicants"
          element={
            <ProtectedRoute role="recruiter">
              <ApplicantsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/applications"
          element={
            <ProtectedRoute role="jobseeker">
              <Applications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/analyzer"
          element={
            <ProtectedRoute role="jobseeker">
              <Analyzer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recommended"
          element={
            <ProtectedRoute role="jobseeker">
              <RecommendedJobsPage jobs={[]} />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage/>}/>
        <Route path="/contact" element={<ContactPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordFlow/>}/>
      </Routes>
    </BrowserRouter>
    
  );
}
export default App;
