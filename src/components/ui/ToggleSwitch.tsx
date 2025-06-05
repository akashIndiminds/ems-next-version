// src/components/ui/ToggleSwitch.tsx
import React from 'react';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isActive}
        onChange={onToggle}
        className="sr-only"
      />
      <div className={`w-11 h-6 bg-gray-200 rounded-full ${isActive ? 'bg-green-600' : ''}`}>
        <div
          className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
            isActive ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
    </label>
  );
};

export default ToggleSwitch;