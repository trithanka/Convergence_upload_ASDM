import React from "react";
import { useTable, usePagination } from "react-table";

interface MasterTableProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  pageSize?: number;
}

const MasterTable: React.FC<MasterTableProps> = ({
  columns = [],
  data = [],
  pageSize = 10,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    nextPage,
    previousPage,
    gotoPage,
    pageOptions,
    setPageSize,
    state: { pageIndex, pageSize: currentPageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageSize },
    },
    usePagination
  );

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-4"><p className="font-bold"></p></div>
      <div className="bg-white overflow-auto border rounded-lg max-h-80 custom-scrollbar">
        {/* Table */ }
        <table
          { ...getTableProps() }
          className="text-xs text-left text-gray-950 border-collapse w-full"
        >
          <thead className="bg-gray-300 uppercase text-xs sticky top-0 z-10">
            { headerGroups.map((headerGroup) => (
              <tr { ...headerGroup.getHeaderGroupProps() }>
                { headerGroup.headers.map((column) => (
                  <th
                    { ...column.getHeaderProps() }
                    className="px-4 py-2 border border-gray-300 text-center"
                  >
                    { column.render("Header") }
                  </th>
                )) }
              </tr>
            )) }
          </thead>
          <tbody { ...getTableBodyProps() } className="divide-y divide-gray-200">
            { data?.length === 0 ? (
              <tr>
                <td colSpan={ columns.length } className="text-center py-4 text-sm">
                  No data found
                </td>
              </tr>
            ) : (
              page?.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    { ...row.getRowProps() }
                    className="hover:bg-gray-50 transition duration-150"
                  >
                    { row.cells.map((cell) => (
                      <td
                        { ...cell.getCellProps() }
                        className="px-6 py-3 text-center whitespace-nowrap border border-gray-300"
                      >
                        { cell.render("Cell") }
                      </td>
                    )) }
                  </tr>
                );
              })
            ) }
          </tbody>

        </table>


      </div>
      {/* Pagination */ }
      <div className="flex flex-col md:flex-row items-center justify-between mt-2 px-4 py-2 rounded-lg border-t">
        <div className="flex items-center mb-2 md:mb-0 space-x-2">
          <label htmlFor="rowsPerPage" className="text-xs font-medium">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            value={ currentPageSize }
            onChange={ (e) => setPageSize(Number(e.target.value)) }
            className="block w-20 px-2 py-1 text-xs border rounded bg-white focus:ring focus:ring-blue-200 focus:outline-none"
          >
            { [5, 10, 15, 20, 25, 30].map((size) => (
              <option key={ size } value={ size }>
                { size }
              </option>
            )) }
          </select>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={ () => gotoPage(0) }
            disabled={ !canPreviousPage }
            className={ `px-3 py-1 rounded ${canPreviousPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }` }
          >
            &laquo; First
          </button>
          <button
            onClick={ () => previousPage() }
            disabled={ !canPreviousPage }
            className={ `px-3 py-1 rounded ${canPreviousPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }` }
          >
            Previous
          </button>
          <span className="text-xs font-medium">
            Page <span className="text-blue-500">{ pageIndex + 1 }</span> of{ " " }
            <span className="text-blue-500">{ pageOptions.length }</span>
          </span>
          <button
            onClick={ () => nextPage() }
            disabled={ !canNextPage }
            className={ `px-3 py-1 rounded ${canNextPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }` }
          >
            Next
          </button>
          <button
            onClick={ () => gotoPage(pageOptions.length - 1) }
            disabled={ !canNextPage }
            className={ `px-3 py-1 rounded ${canNextPage
              ? "bg-blue-500 text-white hover:bg-blue-600"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }` }
          >
            Last &raquo;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MasterTable;
