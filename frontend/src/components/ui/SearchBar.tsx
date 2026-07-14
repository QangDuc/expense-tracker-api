import './SearchBar.css';
import { HiMagnifyingGlass } from 'react-icons/hi2';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = 'Tìm kiếm…' }: SearchBarProps) {
  return (
    <div className="search-bar">
      <HiMagnifyingGlass className="search-bar__icon" />
      <input
        className="search-bar__input"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
