"use client";

import { useForm } from "react-hook-form";

type FormValues = {
  name: string;
  symbol: string;
  baseUri: string;
};

type Props = {
  onSubmit: (data: FormValues) => void;
};

export default function CollectionForm({ onSubmit }: Props) {
  const { register, handleSubmit } = useForm<FormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input placeholder="Name" {...register("name")} required />
      <input placeholder="Symbol" {...register("symbol")} required />
      <input placeholder="Base URI" {...register("baseUri")} required />
      <button type="submit">Create Collection</button>
    </form>
  );
}
