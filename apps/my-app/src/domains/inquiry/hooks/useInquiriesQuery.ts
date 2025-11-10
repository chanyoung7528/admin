import { useQuery } from "@tanstack/react-query";
import { getInquiries } from "../services";

export function useInquiriesQuery() {
  return useQuery({
    queryKey: ["inquiries"],
    queryFn: getInquiries,
  });
}

