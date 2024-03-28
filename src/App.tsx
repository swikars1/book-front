import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
type TBook = { title: String; author: string; id: string };

function BookForm() {
  return (
    <div>
      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex flex-col items-center">
        <h1 className="text-3xl font-bold text-center">Add a Book</h1>

        <form className="mt-8 space-y-6">
          <input type="hidden" name="remember" value="true" />

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Title"
              />
            </div>

            <div>
              <label className="sr-only">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Author"
              />
            </div>
          </div>

          <div>
            <label className="sr-only">Description</label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
                placeholder="Description"
              ></textarea>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring focus:ring-indigo-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              Add Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BookList() {
  const booksData: TBook[] = [
    { id: "1", title: "The fall of snow.", author: "Wild Pence" },
    { id: "2", title: "The Win Over France.", author: "Ken Lupe" },
  ];

  function handleRemove() {}

  function handleUpdate() {}

  function booksRender(book: TBook) {
    return (
      <div className="flex gap-2 justify-between" key={book.id}>
        <div className="flex gap-1">
          <p>{book.title}</p>
          <p className="text-gray-500 italic">{book.author}</p>
        </div>
        <div className="flex gap-2">
          <div className="underline cursor-pointer" onClick={handleUpdate}>
            Update
          </div>
          <div className="underline cursor-pointer" onClick={handleRemove}>
            Remove
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md flex flex-col ">
        <h1 className="text-3xl font-bold text-center">Books</h1>
        {booksData.map((book) => booksRender(book))}
      </div>
    </div>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <BookList />
      <BookForm />
    </QueryClientProvider>
  );
}

export default App;
