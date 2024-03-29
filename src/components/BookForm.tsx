import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createBook } from "../apiClient/mutations/book.mutation";
import { useState } from "react";
import {
  bookCountQueryKey,
  bookListQueryKey,
} from "../apiClient/queries/book.query";
import { z } from "zod";

const createBookSchema = z.object({
  name: z
    .string()
    .max(50, "Upto 50 letters only.")
    .min(2, "Atleast 2 letters required.")
    .trim(),
  author: z
    .string()
    .max(50, "Upto 50 letters only.")
    .min(2, "Atleast 2 letters required.")
    .trim(),
  description: z.string().max(150, "Upto 150 letters only.").trim(),
});

type FormType = z.infer<typeof createBookSchema>;

export function BookForm() {
  const [name, setName] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [formError, setFormError] = useState<
    {
      field: string | number;
      message: string;
    }[]
  >([]);

  const queryClient = useQueryClient();

  function cleanForm() {
    setName("");
    setDescription("");
    setAuthor("");
    setFormError([]);
  }

  const createBookMutation = useMutation({
    mutationFn: createBook,
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
      cleanForm();
    },
  });

  function validate(values: FormType) {
    const safeParsed = createBookSchema.safeParse(values);
    if (safeParsed.success) {
      return safeParsed.data;
    } else {
      const errors = safeParsed.error.issues.map((a) => ({
        field: a.path?.[0],
        message: a.message,
      }));
      setFormError(errors);
      return null;
    }
  }

  function handleCreate() {
    const values: FormType = { name, description, author };
    const validatedValues = validate(values);
    if (validatedValues) {
      createBookMutation.mutate(validatedValues);
    }
  }

  function getErrorMessage(fieldName: string) {
    return formError.find((a) => a.field === fieldName)?.message;
  }

  return (
    <div>
      <div className="p-6  bg-white rounded-xl shadow-md flex flex-col items-center w-[300px]">
        <h1 className="text-3xl font-bold text-center">Add a Book</h1>

        <form className="mt-8 space-y-6 w-full">
          <input type="hidden" name="remember" value="true" />

          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label className="sr-only">Title</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Name"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              />
              <p className="text-red-500 flex mb-3 mt-1 text-sm">
                {getErrorMessage("name")}
              </p>
            </div>

            <div>
              <label className="sr-only">Author</label>
              <input
                id="author"
                name="author"
                type="text"
                onChange={(e) => {
                  setAuthor(e.target.value);
                }}
                value={author}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Author"
              />
              <p className="text-red-500 flex mb-3 mt-1 text-sm">
                {getErrorMessage("author")}
              </p>
            </div>
          </div>

          <div>
            <label className="sr-only">Description</label>
            <div className="mt-1">
              <textarea
                id="description"
                name="description"
                placeholder="Description"
                rows={3}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                value={description}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md px-3 py-2"
              ></textarea>
              {getErrorMessage("description")}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                handleCreate();
              }}
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
