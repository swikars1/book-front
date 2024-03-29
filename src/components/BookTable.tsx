import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteBook } from "../apiClient/mutations/book.mutation";
import {
  TBook,
  bookCountQueryKey,
  bookListQueryKey,
  useBookCount,
  useBookList,
} from "../apiClient/queries/book.query";
import { useState } from "react";
import { useDebounce } from "../utils/useDebounce";

export function BookTable() {
  const queryClient = useQueryClient();
  const [searchVal, setSearchVal] = useState("");

  const debouncedSearchVal = useDebounce(searchVal, 400);

  const { data: count, isLoading: loadingCount } = useBookCount();
  const {
    data: infiniteBookList,
    fetchNextPage,
    isLoading,
  } = useBookList({
    searchVal: debouncedSearchVal || "",
  });

  const flatBookList = infiniteBookList?.pages?.flatMap((page) => page.data);

  const deleteBookMutation = useMutation({
    mutationFn: deleteBook,
    onError: (err) => {
      console.log({ err });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: bookListQueryKey.all,
      });
      queryClient.invalidateQueries({
        queryKey: bookCountQueryKey.all,
      });
    },
  });

  function handleRemove(id: number) {
    deleteBookMutation.mutate(id);
  }

  function handleLoadMore() {
    fetchNextPage();
  }

  function booksRender(book: TBook) {
    return (
      <div
        className="flex gap-2 justify-between mt-2 book-render"
        key={book.id}
      >
        <div className="flex gap-1">
          <p>{book.name}</p>
          <p className="text-gray-500 italic"> - {book.author?.name || ""}</p>
        </div>
        <div className="flex gap-2">
          <div
            className="underline cursor-pointer remove-book-link"
            onClick={() => handleRemove(book.id)}
          >
            Remove
          </div>
        </div>
      </div>
    );
  }

  function BookList() {
    return flatBookList?.length ? (
      flatBookList?.map((book) => booksRender(book))
    ) : isLoading ? (
      <p>Loading...</p>
    ) : (
      <p className="no-books-message">No books found!</p>
    );
  }

  function TotalBooks() {
    if (count?.totalBooks || count?.totalBooks === 0) {
      return (
        <p className="font-medium text-lg" id="totalBooks">
          Total books in the library: {count?.totalBooks}
        </p>
      );
    }
    return loadingCount ? <p className="font-medium text-lg">Loading..</p> : "";
  }

  return (
    <div className="overflow-auto p-6 w-[560px] h-[600px] bg-white rounded-xl shadow-md flex flex-col justify-between ">
      <div>
        <div className="flex flex-col gap-2 items-start">
          <div className="flex justify-between mb-3 w-full">
            <h1 className="text-3xl font-bold text-center">Books</h1>
            <input
              id="search-book"
              name="search-book"
              type="text"
              onChange={(e) => setSearchVal(e.target.value)}
              value={searchVal}
              className="appearance-none rounded-none relative block w-[200px] px-2 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Search Title or Author"
            />
          </div>
          <TotalBooks />
        </div>
        <div>
          <BookList />
        </div>
      </div>
      {count?.totalBooks &&
      flatBookList &&
      !searchVal &&
      flatBookList?.length < count?.totalBooks ? (
        <div className="flex gap-2 justify-center mt-4 underline">
          <p className="cursor-pointer text-lg" onClick={handleLoadMore}>
            Load More
          </p>
        </div>
      ) : null}
    </div>
  );
}
