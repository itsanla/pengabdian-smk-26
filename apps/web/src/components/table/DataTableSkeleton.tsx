import { Skeleton } from "../common/Skeleton";

export function DataTableSkeleton({ columns }: { columns: { header: string }[] }) {
  return (
    <>
      <div className="flex items-center mb-6 gap-2">
        <div className="relative flex-1 max-w-sm">
          <Skeleton className="h9"/>
        </div>
        <Skeleton className="h-9 w-[100px]"/>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto border rounded">
          <table className="table-auto w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
              <tr>
                {columns.map((value, index) => (
                  <th key={index} className="p-3 border-b">
                    {value.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }, (_, index) => (
                <tr key={index} className="border-b">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="p-3">
                      <Skeleton className="w-full h-6" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-[200px]" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-[40px]" />
            <Skeleton className="h-9 w-[40px]" />
          </div>
        </div>
      </div>
    </>
  );
}
