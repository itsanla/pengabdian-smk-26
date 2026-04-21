import { ColumnDef, Column, Row } from "@tanstack/react-table";
import { User } from "@/types";
import { Button } from "@/components/landing/ui/button";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";

interface UserTableActionsProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

export const createColumns = ({ onEdit, onDelete }: UserTableActionsProps): ColumnDef<User>[] => [
  {
    accessorKey: "nama",
    header: "Nama"
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }: { row: Row<User> }) => {
      const user = row.original;
      return (
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(user)}
            className="p-2 bg-yellow-500 hover:bg-yellow-400 text-white rounded transition-colors">
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(user.id)}
            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      );
    },
  },
];
