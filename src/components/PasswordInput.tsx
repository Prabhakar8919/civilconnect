import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, CheckCircle2, XCircle, Lock } from "lucide-react";
import { validatePassword } from "@/lib/passwordValidation";

interface PasswordInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showValidation?: boolean;
  required?: boolean;
  className?: string;
}

export const PasswordInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = "Enter password",
  showValidation = false,
  required = false,
  className = "",
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const validation = validatePassword(value);
  const showErrors = showValidation && touched && value.length > 0;

  const requirements = [
    { text: "At least 8 characters", met: value.length >= 8 },
    { text: "One uppercase letter (A-Z)", met: /[A-Z]/.test(value) },
    { text: "One lowercase letter (a-z)", met: /[a-z]/.test(value) },
    { text: "One number (0-9)", met: /[0-9]/.test(value) },
    { text: "One special character (!@#$%^&*)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value) },
  ];

  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-2 text-base font-bold">
        <Lock className="h-4 w-4 text-primary" />
        {label} {required && <span className="text-red-600">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={placeholder}
          className={`h-12 pr-10 ${className} ${
            showErrors && !validation.isValid ? "border-red-500 focus:border-red-500" : ""
          }`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      {showValidation && value.length > 0 && !validation.isValid && (
        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300">
            Password Requirements:
          </p>
          <ul className="space-y-1">
            {requirements.map((req, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {req.met ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                )}
                <span className={req.met ? "text-green-600" : "text-red-500"}>
                  {req.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
