import { ChangeEvent } from "react";

interface RadioButtonProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}


const RadioButton = ({ name, value, label, checked, onChange }:RadioButtonProps) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="form-radio text-blue-600 focus:ring-blue-500"
      />
      <span className="text-gray-800">{label}</span>
    </label>
  );
};

export default RadioButton
