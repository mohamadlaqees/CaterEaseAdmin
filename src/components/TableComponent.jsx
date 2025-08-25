// src/components/TableComponent.js

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { Link } from "react-router"; // Corrected import for react-router

const TableComponent = ({
  tableHeader,
  tableBody,
  tableClass,
  isLoading,
  direction,
}) => {
  const headerCount = tableHeader.length;
  return (
    <div className="w-full overflow-x-auto">
      <Table className={tableClass}>
        <TableHeader>
          <TableRow>
            {tableHeader.map((header) => (
              <TableHead key={header.name} className={header.class}>
                {header.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={headerCount} className="h-24 text-center">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              </TableCell>
            </TableRow>
          ) : tableBody && tableBody.length > 0 ? (
            tableBody.map((body) => (
              <TableRow key={body.id}>
                {tableHeader.map((header) => (
                  <TableCell key={header.name} className={body.class}>
                    {header.key === "name" ? (
                      <Link to={direction ? `/${direction}/${body.id}` : ""}>
                        {header.render ? header.render(body) : body[header.key]}
                      </Link>
                    ) : header.render ? (
                      header.render(body)
                    ) : (
                      body[header.key]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={headerCount} className="h-24 text-center">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableComponent;
