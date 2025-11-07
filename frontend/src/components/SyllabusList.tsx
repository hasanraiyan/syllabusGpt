import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Syllabus } from "@syllabus-api/sdk";
import { SyllabusDetail } from "./SyllabusDetail";

export function SyllabusList({ syllabi }: { syllabi: Syllabus[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Subject Name</TableHead>
          <TableHead>Branch</TableHead>
          <TableHead>Semester</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {syllabi.map((syllabus) => (
          <TableRow key={syllabus.id}>
            <TableCell>{syllabus.subject?.name}</TableCell>
            <TableCell>{syllabus.branch}</TableCell>
            <TableCell>{syllabus.semester}</TableCell>
            <TableCell>
              <SyllabusDetail syllabus={syllabus} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
