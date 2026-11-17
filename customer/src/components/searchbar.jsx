export default function Searchbar({ value, onChange }) {
  return (
    <label className="customer-searchbar">
      <span aria-hidden="true">⌕</span>
      <input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search products..."
        aria-label="Search products"
      />
    </label>
  );
}
