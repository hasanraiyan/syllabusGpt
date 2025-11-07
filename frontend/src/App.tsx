import { useState } from "react";
import { DefaultApi, Syllabus } from "@syllabus-api/sdk";
import { SearchBar } from "./components/SearchBar";
import { SyllabusList } from "./components/SyllabusList";

const api = new DefaultApi();

function App() {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);

  const handleSearch = (query: string) => {
    api.searchSyllabus({ q: query }).then((response) => {
      setSyllabi(response.results ?? []);
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Syllabus Search</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="mt-8">
        {syllabi.length > 0 ? (
          <SyllabusList syllabi={syllabi} />
        ) : (
          <p>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
