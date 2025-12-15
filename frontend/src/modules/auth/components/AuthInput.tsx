
interface AuthInputProps {
  label: string;
  type?: string;
  value: string;
  placeholder?:string
  onChange: (value: string) => void;
}

const AuthInput = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
}:AuthInputProps) => {
    return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );

};

export default AuthInput;
