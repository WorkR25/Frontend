import { X } from "lucide-react";
import React from "react";

interface ConfirmLoginDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onSignup: () => void;
  title?: string;
  message?: string;
}

const ConfirmLoginDialog: React.FC<ConfirmLoginDialogProps> = ({
  isOpen,
  onClose,
  onSignup,
  onLogin,
  title = "You are not logged in",
  message = "Login or Signup to continue.",
}) => {
  if (!isOpen) return null;

  return (
    <div className="border fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-gray-200 opacity-[2%]"
        onClick={onClose}
      ></div>

      <div className="relative border-gray-600 border bg-white rounded-2xl shadow-lg w-full max-w-md p-6 z-10">
        <div
          className="components-createJob-CreateJobForm absolute top-2 right-2 hover:cursor-pointer "
          onClick={onClose}
        >
          <X width={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <p className="text-gray-600 mt-2">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onSignup}
            className="hover:cursor-pointer px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Signup
          </button>
          <button
            onClick={onLogin}
            className="hover:cursor-pointer px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLoginDialog;
