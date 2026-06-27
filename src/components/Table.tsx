import { useState } from "react";
import { data } from "../utils/data";
import { BiSort } from "react-icons/bi";
import { AiOutlineDown } from "react-icons/ai";
import { MdSort } from "react-icons/md";

// Interface modeling structural shape of dataset items
interface Project {
  client: string;
  country: string;
  email: string;
  project: string;
  progress: string;
  status: string;
  date: string;
  image: string;
}

/**
 * Table Component
 * A robust data rendering dashboard table featuring localized column sorting,
 * independent property-scoped inputs, dynamic global search string query matching,
 * and sliced client-side page-by-page index array navigation blocks.
 */
const Table = () => {
  // --- Data & Visibility State Management ---
  const [projects, setProjects] = useState<Project[]>(data);
  const [dropDownVisible, setDropDownVisible] = useState<boolean>(false);
  const [filterVisible, setFilterVisible] = useState<boolean>(false);

  // Tracks sorting context definitions to manage active column headers toggle sequences
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: string;
  } | null>(null);

  // Houses tracking string metrics mapping uniquely back to specific data properties
  const [filters, setFilters] = useState({
    name: "",
    country: "",
    email: "",
    project: "",
    status: "",
  });

  // Global cross-column text string matchmaking pattern hook
  const [searchQuery, setSearchQuery] = useState<string>("");

  /**
   * Sorts the project data state by comparing a targeted array index object property key string
   * @param key - Selected row criteria model attribute selected for re-ordering pipelines
   */
  const sortProjects = (key: string) => {
    const sortedProjects = [...projects];

    // Check if column is already sorted ascend to determine descending invert conditions
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      sortedProjects.sort((a, b) =>
        a[key as keyof Project] > b[key as keyof Project] ? -1 : 1,
      );
      setSortConfig({ key, direction: "descending" });
    } else {
      sortedProjects.sort((a, b) =>
        a[key as keyof Project] > b[key as keyof Project] ? 1 : -1,
      );
      setSortConfig({ key, direction: "ascending" });
    }
    setProjects(sortedProjects);
  };

  /**
   * Dispatches targeted key mutations and auto-collapses open dropdown popup overlay sheets
   */
  const handleSortOptionClick = (key: string) => {
    sortProjects(key);
    setDropDownVisible(false);
  };

  /**
   * Syncs user keystrokes into structured input name object field values state paths
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // --- Multi-Layer Computed Filtering Execution Matrix ---
  // Calculates combined outputs matching both the global omni-search matching criteria
  // as well as any existing column-isolated custom value constraints.
  const filteredProjects = projects.filter(
    (project) =>
      // Layer 1: Evaluates global omni-search text parameters over all column indexes
      (searchQuery === "" ||
        Object.values(project).some((value) =>
          value.toLowerCase().includes(searchQuery.toLowerCase()),
        )) &&
      // Layer 2: Applies column-specific criteria constraints sequentially
      (filters.name === "" ||
        project.client.toLowerCase().includes(filters.name.toLowerCase())) &&
      (filters.country === "" ||
        project.country
          .toLowerCase()
          .includes(filters.country.toLowerCase())) &&
      (filters.email === "" ||
        project.email.toLowerCase().includes(filters.email.toLowerCase())) &&
      (filters.project === "" ||
        project.project
          .toLowerCase()
          .includes(filters.project.toLowerCase())) &&
      (filters.status === "" ||
        project.status.toLowerCase().includes(filters.status.toLowerCase())),
  );

  // --- Pagination Slicing Layer ---
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Extract correct window blocks belonging to current active views out of matched pipelines
  const currentProjects = filteredProjects.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

  /**
   * Shifts target component page frames pointers forward or backward
   */
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-4 w-[93%] ml-20">
      {/* =========================================================================
          CONTROL ACTIONS PANEL HEADER BAR
          ========================================================================= */}
      <div className="flex items-center mb-5">
        {/* Sorting Dropdown Shell Menu */}
        <div className="relative">
          <button
            onClick={() => setDropDownVisible(!dropDownVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-700/80 text-sm font-medium rounded-lg text-gray-200 border border-gray-700 transition-colors"
          >
            <BiSort className="mr-[0.3rem]" />
            Sort
            <AiOutlineDown className="ml-2" />
          </button>

          {dropDownVisible && (
            <div className="absolute top-full left-0 mt-2 z-10 bg-gray-800 border border-gray-700 rounded shadow-lg min-w-35">
              <button
                onClick={() => handleSortOptionClick("client")}
                className="block px-4 py-2 text-left text-white w-full hover:bg-gray-700 text-sm"
              >
                Name
              </button>
              <button
                onClick={() => handleSortOptionClick("country")}
                className="block px-4 py-2 text-left text-white w-full hover:bg-gray-700 text-sm"
              >
                Country
              </button>
              <button
                onClick={() => handleSortOptionClick("date")}
                className="block px-4 py-2 text-left text-white w-full hover:bg-gray-700 text-sm"
              >
                Date
              </button>
            </div>
          )}
        </div>

        {/* Modular Fields Filtering Selection Context popover card box */}
        <div className="relative ml-4 w-full">
          <button
            onClick={() => setFilterVisible(!filterVisible)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 active:bg-gray-700/80 text-sm font-medium rounded-lg text-gray-200 border border-gray-700 transition-colors"
          >
            <MdSort className="mr-[0.3rem]" /> Filter
            <AiOutlineDown className="ml-2" />
          </button>

          {filterVisible && (
            <div className="absolute top-full left-0 mt-2 z-10 bg-gray-800 border border-gray-700 rounded shadow-lg p-4 w-72">
              <div className="mb-2">
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Filter By Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  className="bg-gray-900 text-white rounded p-2 w-full text-sm focus:outline-none border border-transparent focus:border-gray-600"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Filter By Country:
                </label>
                <input
                  type="text"
                  name="country"
                  value={filters.country}
                  onChange={handleFilterChange}
                  className="bg-gray-900 text-white rounded p-2 w-full text-sm focus:outline-none border border-transparent focus:border-gray-600"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Filter By Email:
                </label>
                <input
                  type="text"
                  name="email"
                  value={filters.email}
                  onChange={handleFilterChange}
                  className="bg-gray-900 text-white rounded p-2 w-full text-sm focus:outline-none border border-transparent focus:border-gray-600"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Filter By Project:
                </label>
                <input
                  type="text"
                  name="project"
                  value={filters.project}
                  onChange={handleFilterChange}
                  className="bg-gray-900 text-white rounded p-2 w-full text-sm focus:outline-none border border-transparent focus:border-gray-600"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-400 font-medium mb-1">
                  Filter By Status:
                </label>
                <input
                  type="text"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="bg-gray-900 text-white rounded p-2 w-full text-sm focus:outline-none border border-transparent focus:border-gray-600"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          CORE STRUCTURAL MATRIX VISUAL DATA GRID
          ========================================================================= */}
      <div className="w-full overflow-x-auto rounded border border-gray-700">
        <table className="min-w-full table-auto text-white">
          <thead className="bg-gray-800 text-gray-400 text-xs font-semibold uppercase tracking-wider border-b border-gray-700">
            <tr>
              <th scope="col" className="px-5 py-3 text-left">
                Image
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Name
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Country
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Email
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Project Name
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Task Progress
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Status
              </th>
              <th scope="col" className="px-5 py-3 text-left">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800 bg-gray-900/40">
            {/* Map down elements iteratively over the paginated active page chunk instead of root lists */}
            {currentProjects.map((project, index) => (
              <tr
                key={index}
                className="hover:bg-gray-800/40 transition-colors group"
              >
                <td className="px-4 py-2 whitespace-nowrap">
                  <img
                    src={project.image}
                    alt={project.client}
                    className="w-8 h-8 rounded-full object-cover border border-gray-700"
                  />
                </td>
                <td className="px-4 py-2 whitespace-nowrap font-medium">
                  {project.client}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-400">
                  {project.country}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-400">
                  {project.email}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-gray-300">
                  {project.project}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-blue-400 font-mono text-sm">
                  {project.progress}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <span className="px-2 py-0.5 text-xs bg-gray-800 border border-gray-700 rounded text-gray-300">
                    {project.status}
                  </span>
                </td>
                <td className="px-4 py-2 whitespace-nowrap font-mono text-xs text-gray-400">
                  {project.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          PAGINATION BAR LAYOUT NAVIGATION CONTROLS
          ========================================================================= */}
      <div className="flex justify-end mt-4 items-center">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 text-sm bg-gray-700 text-white rounded mr-2 disabled:opacity-50 hover:bg-gray-600 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-sm text-gray-400">
          Page {currentPage} of {totalPages || 1}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 text-sm bg-gray-700 text-white rounded disabled:opacity-50 hover:bg-gray-600 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
