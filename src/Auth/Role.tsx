interface RoleProps {
  role: string;
  setRole: (role: string) => void;
}

export function Role({ role, setRole }: RoleProps) {
  return (
    <div className="flex justify-center gap-6 mb-3 text-sm mt-3 ">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={role === "jobseeker"}
          onChange={() => setRole("jobseeker")}
        />
        Job Seeker
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          checked={role === "recruiter"}
          onChange={() => setRole("recruiter")}
        />
        Recruiter
      </label>
    </div>
  );
}
