type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: () => void;
};

export const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-gray-600 px-4 py-2 transition">
      <input checked={checked} className="h-5 w-5 cursor-pointer accent-blue-600" onChange={onChange} type="checkbox" />
      <span className="select-none font-medium text-sm">{label}</span>
    </label>
  );
};
