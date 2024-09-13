import { useState } from "react";

interface ToggleEditModeButtonProps {
  onToggle: (isEditMode: boolean) => void;
  isEditMode: boolean;
}

const ToggleEditModeButton: React.FC<ToggleEditModeButtonProps> = ({ onToggle, isEditMode }) => {
  const handleClick = () => {
    onToggle(!isEditMode);
  };

  return (
    <button
      onClick={handleClick}
      className="px-4 py-2 bg-blue-500 text-white rounded"
    >
      {isEditMode ? "Disable Edit Mode" : "Enable Edit Mode"}
    </button>
  );
};

export default ToggleEditModeButton;
