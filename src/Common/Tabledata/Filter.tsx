//this is the filter logic that we use to filter the columns when we click on them inside the tables
//These components are commonly used with libraries like React Table to enable dynamic filtering for tables.
//SO IT'S A FEATURE THAT REACT PROVIDE
//THIS CODE WAS TAKEN FROM THE REACT DOCUMENTATION PAGE




import React from 'react';

// The `Filter` component renders a column's filter UI if it exists.
// Props:
// - `column`: Represents a column object, which may include a `Filter` property and a `render` method to render the filter UI.
export const Filter = ({ column }: any) => {
  return (
    <>
      {/* Check if the column has a Filter property */}
      {column.Filter && (
        <div style={{ marginTop: 5 }}>
          {/* Render the filter UI using the column's `render` method */}
          {column.render('Filter')}
        </div>
      )}
    </>
  );
};

// Interface defining the structure of `DefaultColumnFilter` props
interface DefaultColumnProps {
  column?: any; // Represents the column object
  filterValue?: any; // Current value of the filter
  setFilter?: any; // Function to update the filter value
  preFilteredRows?: any; // Array of rows before filtering
}

// `DefaultColumnFilter` provides a text input field for filtering rows.
// Props:
// - `column`: Contains filter-related properties (filterValue, setFilter, preFilteredRows).
export const DefaultColumnFilter = ({
  column: {
    filterValue, // Current filter value
    setFilter, // Function to update the filter
    preFilteredRows: { length }, // Total number of rows before filtering
  },
}: DefaultColumnProps) => {
  return (
    // Input field for filtering rows
    <input
      value={filterValue || ''} // Set the current filter value or an empty string
      onChange={(e: any) => {
        // Update the filter value on user input
        setFilter(e.target.value || undefined);
      }}
      placeholder={`search (${length}) ...`} // Placeholder with row count
    />
  );
};

// Interface defining the structure of `SelectColumnFilter` props
interface SelectColumnFilterProps {
  column?: any; // Represents the column object
  filterValue?: any; // Current value of the filter
  setFilter?: any; // Function to update the filter value
  preFilteredRows?: any; // Array of rows before filtering
  id?: any; // Column ID for filtering
}

// `SelectColumnFilter` provides a dropdown menu for filtering rows by unique values.
// Props:
// - `column`: Contains filter-related properties (filterValue, setFilter, preFilteredRows, id).
export const SelectColumnFilter = ({
  column: { filterValue, setFilter, preFilteredRows, id },
}: SelectColumnFilterProps) => {
  // Generate a list of unique values in the column for the dropdown
  const options = React.useMemo(() => {
    const options: any = new Set();
    // Iterate through pre-filtered rows to collect unique values
    preFilteredRows.forEach((row: any) => {
      options.add(row.values[id]); // Add unique values based on column ID
    });
    return [...options.values()]; // Convert the Set to an array
  }, [id, preFilteredRows]);

  return (
    // Dropdown menu for filtering rows
    <select
      id='custom-select'
      className="form-select" // Use a custom class for styling
      value={filterValue} // Set the current filter value
      onChange={(e) => {
        // Update the filter value on user selection
        setFilter(e.target.value || undefined);
      }}
    >
      {/* Default option to show all rows */}
      <option value=''>All</option>
      {/* Render options for each unique value */}
      {options.map((option: any) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};
