"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge"
// import { Checkbox } from "@/components/ui/checkbox";
// import { useApi } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";
import { useCrud } from "@/hooks/use-crud";
import { OfficeType } from "@/types";
// import { Badge } from "@/components/ui/badge";

export default function Office() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const { toast } = useToast();

  const { useFetchAll, useCreate } = useCrud("offices");
  const createMutation = useCreate();

  const { data, isLoading, error } = useFetchAll({ page, limit }) as {
    data: { data: OfficeType[]; message: string; pagination: any };
    isLoading: boolean;
    error: any;
  };  

  // Total halaman dari response API
  const totalPages = data?.pagination.totalPages || 1;

  // Event handler untuk mengganti limit
  const handleLimitChange = (newLimit: number) => {
    console.log(newLimit);
    
    setLimit(newLimit);
    setPage(1); // Reset ke halaman pertama saat limit berubah
  };

  // Event handler untuk mengganti halaman
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  //   console.log(data.data.leng);

  const handleCreateTask = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newTask: OfficeType = {
      name: formData.get("name") as string,
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      radius: Number(formData.get("radius")),
    };

    createMutation.mutate(newTask, {
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Office created successfully",
          variant: "default",
        });
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to create office",
          variant: "destructive",
        });
      },
    });

    setIsCreateModalOpen(false);
  };

  //   const handleEditTask = (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault()
  //     if (!selectedTask) return

  //     const formData = new FormData(event.currentTarget)
  //     const updatedTask: Task = {
  //       ...selectedTask,
  //       type: formData.get("type") as Task["type"],
  //       title: formData.get("title") as string,
  //       status: formData.get("status") as Task["status"],
  //       priority: formData.get("priority") as Task["priority"],
  //     }

  //     setTasks(tasks.map(task => task.id === selectedTask.id ? updatedTask : task))
  //     setIsEditModalOpen(false)
  //     setSelectedTask(null)
  //   }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-muted-foreground">
            Heres a list of your tasks for this month!
          </p>
        </div>
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={handleCreateTask}
              method="POST"
              encType="multipart/form-data"
              className="space-y-4"
            >
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input name="name" required />
              </div>
              <div>
                <label className="text-sm font-medium">Latitude</label>
                <Input name="latitude" type="number" required />
              </div>
              <div>
                <label className="text-sm font-medium">Longitude</label>
                <Input name="longitude" type="number" required />
              </div>
              <div>
                <label className="text-sm font-medium">Radius</label>
                <Input name="radius" type="number" required />
              </div>

              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Input placeholder="Search offices" className="max-w-sm" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>no</TableHead>
              <TableHead>name</TableHead>
              <TableHead>latitide</TableHead>
              <TableHead>longitude</TableHead>
              <TableHead>radius</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data &&
              data.data.map((data, index) => (
                <TableRow key={data.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{data.name}</TableCell>
                  <TableCell>{data.latitude}</TableCell>
                  <TableCell>{data.longitude}</TableCell>
                  <TableCell>{data.longitude}</TableCell>
                  <TableCell>{data.radius}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <Pagination className="gap-4 mt-4 flex justify-end">
          <PaginationContent>
            {/* Tombol Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, page - 1))}
              />
            </PaginationItem>

            {/* Tombol Page Number */}
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i + 1}>
                <PaginationLink
                  isActive={page === i + 1}
                  onClick={() => handlePageChange(i + 1)}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}

            {/* Tombol Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
              />
            </PaginationItem>
          </PaginationContent>

          {/* Dropdown untuk jumlah item per halaman */}
          <Select defaultValue="10" onValueChange={(value) => handleLimitChange(Number(value))}>
            <SelectTrigger className="w-[70px]">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50, 100].map((option) => (
                  <SelectItem
                    key={option}
                    value={option.toString()}
                  >
                    {option}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Pagination>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {/* {selectedTask && (
            <form onSubmit={handleEditTask} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <Input name="name" defaultValue={selectedTask.name} required />
              </div>
              <div>
                <label className="text-sm font-medium">Latitude</label>
                <Input name="latitude" type="number" defaultValue={selectedTask.latitude} required />
              </div>
              <div>
                <label className="text-sm font-medium">Longitude</label>
                <Input name="longitude" type="number" defaultValue={selectedTask.longitude} required />
              </div>
              <div>
                <label className="text-sm font-medium">Radius</label>
                <Input name="radius" type="number" defaultValue={selectedTask.radius} required />
              </div>
              
              <Button type="submit" className="w-full">Update Task</Button>
            </form>
          )} */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
