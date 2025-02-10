"use client";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateV3 } from "@/lib/format-date";
import { EllipsisVertical, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import fetchGlobal from "@/lib/fetch-data";
import { useToast } from "@/hooks/use-toast";
import RegisterUserComponent from "./register-user";
import AlertComponentDeleteUser from "./remove-user";
import { handleName } from "@/lib/utils";

const UserPageComponent = ({ data, reFetch }) => {
  const { toast } = useToast();
  // Initialize state
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [currentId, setCurrentId] = useState();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [typeBtn, setTypeBtn] = useState("");

  const handleDropdownToggle = (id, isOpen) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: isOpen }));
  };

  const handleClickDelete = async (e) => {
    e.preventDefault();

    setError("");
    if (loading) return;
    try {
      setLoading(true);
      const endpoint = `/v1/delete-user/${currentId}`;
      const options = {
        method: "DELETE",
      };

      const result = await fetchGlobal(endpoint, options, true);
      setLoading(false);
      setOpenDelete(false);
      setError("");

      if (result) {
        toast({
          title: "Deleted created successfully! ❌",
          description:
            "The item has been permanently deleted. This action cannot be undone.",
          variant: "default",
          className: "bg-emerald-50 text-black",
        });

        reFetch();
      }
    } catch (error) {
      setLoading(false);
      setError(error?.message || "Something when wrong");
    }
  };

  return (
    <React.Fragment>
      <div className="flex justify-end">
        <button
          className="flex items-center justify-center gap-1 border border-gray-200 rounded-md px-3 text-sm py-1 shadow-sm"
          onClick={() => {
            setOpenAdd(true);
            setTypeBtn("add");
          }}
        >
          add
          <Plus size={14} />
        </button>
      </div>

      <div className="mt-7">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {!data ? (
              <>
                {[...Array(10)].map((_, rowIndex) => (
                  <tr key={rowIndex + "raw"} className="hover:bg-transparent">
                    {[...Array(4)].map((_column, colIndex) => (
                      <td key={colIndex + "col"} className="py-4">
                        <div className="animate-pulse rounded-md bg-muted h-6 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ) : (
              <>
                {data.map((item, index) => (
                  <TableRow key={`user-${index}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-300 text-black flex items-center justify-center shrink-0">
                          <h1>{handleName(item.full_name)}</h1>
                        </div>
                        <div className="min-w-24">
                          <div className="font-medium capitalize">
                            {item.full_name}
                          </div>
                          <span className="mt-0.5 text-xs text-muted-foreground">
                            {item.role}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.phone_number}</TableCell>
                    <TableCell>
                      <div className="whitespace-nowrap">
                        {formatDateV3(item.updatedAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu
                        open={openDropdowns[index] || false}
                        onOpenChange={(isOpen) =>
                          handleDropdownToggle(index, isOpen)
                        }
                      >
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="rounded-full shadow-none"
                            aria-label="Open edit menu"
                          >
                            <EllipsisVertical
                              size={16}
                              strokeWidth={2}
                              aria-hidden="true"
                            />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              handleDropdownToggle(index, false);
                              setOpenAdd(true);
                              setCurrentId(item.id);
                              setCurrentUser(item);
                              setTypeBtn("edit");
                            }}
                          >
                            edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:text-destructive"
                            onClick={() => {
                              handleDropdownToggle(index, false);
                              setOpenDelete(true);
                              setCurrentId(item.id);
                            }}
                          >
                            delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialog Add User */}

      {openAdd && (
        <RegisterUserComponent
          openDialog={openAdd}
          setOpenDialog={setOpenAdd}
          data={currentUser}
          setData={setCurrentUser}
          type={typeBtn}
          reFetch={reFetch}
        />
      )}

      {openDelete && (
        <AlertComponentDeleteUser
          isLoading={loading}
          openDialog={openDelete}
          setOpenDialog={setOpenDelete}
          handleClick={handleClickDelete}
          error={error}
          setError={setError}
        />
      )}
    </React.Fragment>
  );
};

export default UserPageComponent;
