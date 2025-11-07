import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Syllabus } from "@syllabus-api/sdk";

export function SyllabusDetail({ syllabus }: { syllabus: Syllabus }) {
  return (
    <Dialog>
      <DialogTrigger>View Details</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{syllabus.subject?.name}</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p><strong>Branch:</strong> {syllabus.branch}</p>
          <p><strong>Semester:</strong> {syllabus.semester}</p>
          <p><strong>Description:</strong> {syllabus.subject?.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
