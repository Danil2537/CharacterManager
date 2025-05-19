import Head from "next/head";
import Link from "next/link";
import { api } from "../../../utils/api";

export default function ClassChoosing() {
    const { data: classes, isLoading, isError } = api.creation.getAllClasses.useQuery(
        undefined, // No input expected
        {
          enabled: typeof window !== "undefined", // Only run this query on client-side
        }
      );
    return <></>;
}