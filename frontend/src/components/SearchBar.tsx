import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBar({ onSearch }: { onSearch: (query: string) => void }) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = formData.get("search") as string;
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input type="text" name="search" placeholder="Search for a subject..." />
      <Button type="submit">Search</Button>
    </form>
  );
}
