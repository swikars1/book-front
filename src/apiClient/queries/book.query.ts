import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { API } from "../API";

export type TBook = { name: String; author: { name: string }; id: number };

const getBookList = async (pageParam: number, searchVal: string) => {
  const { data } = await API.get("/v1/books/list", {
    params: {
      page: pageParam,
      q: searchVal,
    },
  });

  return { data, page: pageParam } as {
    data: TBook[];
    page: number;
  };
};

export const bookListQueryKey = {
  all: ["ALL_BOOK_LIST"] as const,
  searching: (searchVal: string) =>
    [...bookListQueryKey.all, searchVal] as const,
};
const useBookList = ({ searchVal }: { searchVal: string }) => {
  return useInfiniteQuery({
    queryKey: bookListQueryKey.searching(searchVal),
    queryFn: ({ pageParam }) => getBookList(pageParam, searchVal),
    getNextPageParam: (lastPage: { data: TBook[]; page: number }) => {
      if (lastPage?.data?.length) {
        return lastPage.page!! + 1;
      }
      return undefined;
    },

    initialPageParam: 1,
  });
};

const getBooksCount = async () => {
  const { data } = await API.get("/v1/books/count");

  return data as { totalBooks: number };
};

export const bookCountQueryKey = {
  all: ["ALL_BOOK_COUNT"] as const,
};
const useBookCount = () =>
  useQuery({
    queryFn: getBooksCount,
    queryKey: bookCountQueryKey.all,
  });

export { useBookList, useBookCount };
