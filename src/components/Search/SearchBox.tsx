import { SearchOutlined } from "@ant-design/icons";
import { AutoComplete, Input, Spin } from "antd";
import { useState } from "react";
import { useSearch } from "../../hooks/useSearch";
import type { Location } from "../../types/location";

interface SearchBoxProps {
  locations: Location[];
  onSelect: (locationId: string) => void;
  onSearchResultSelect: (lat: number, lon: number) => void;
}

export function SearchBox({
  locations,
  onSelect,
  onSearchResultSelect,
}: SearchBoxProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { loading, options, handleSearch } = useSearch(locations);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    handleSearch(value);
  };

  const handleSelect = (value: string, option: any) => {
    setSearchTerm(value);

    if (value.startsWith("search-")) {
      const { lat, lon } = option.data;
      onSearchResultSelect(parseFloat(lat), parseFloat(lon));
    } else {
      onSelect(value);
    }
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] w-80">
      <AutoComplete
        options={options}
        onSelect={handleSelect}
        className="w-full"
        placeholder="Search locations or addresses..."
        notFoundContent={loading ? <Spin size="small" /> : null}
      >
        <Input
          size="large"
          value={searchTerm} // Controlled input
          onChange={(e) => handleSearchChange(e.target.value)} // Update term on input change
          prefix={<SearchOutlined className="text-gray-400" />}
          className="rounded-lg shadow-lg"
        />
      </AutoComplete>
    </div>
  );
}
