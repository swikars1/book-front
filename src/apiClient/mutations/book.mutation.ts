import { API } from "../API";
import { TBook } from "../queries/book.query";

const deleteBook = async (id: number) => {
  const { data } = await API.delete(`/v1/books/${id}`);

  return data as TBook;
};

const createBook = async (values: {
  name: string;
  description: string;
  author: string;
}) => {
  const { data } = await API.post(`/v1/books/`, values);

  return data as TBook;
};

export { deleteBook, createBook };
