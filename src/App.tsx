import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { BookForm } from "./components/BookForm";
import { BookTable } from "./components/BookTable";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex gap-4 justify-center flex-wrap">
        <BookForm />
        <BookTable />
      </div>
    </QueryClientProvider>
  );
}

export default App;
