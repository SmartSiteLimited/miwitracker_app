import { toast } from "@/ui/toast";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function verifyResponse(error: any, statusCode: number | null = null) {
//   if (error || !(statusCode?.toString().startsWith("2") || statusCode?.toString().startsWith("3"))) {
//     handleErrorResp(error, statusCode);
//     return false
//   }

//   return true
// }

// export function handleErrorResp(error: unknown, statusCode: number | null = null) {
//   let msg = "";
//   if (error) {
//     if (error instanceof Error) {
//       if (Array.isArray(error.message)) {
//         msg = error.message.map((e) => e.msg).join(", ");
//       } else {
//         msg = error.message;
//       }
//     } else if (typeof error === "string") {
//       msg = error;
//     }
//   } else {
//     if (statusCode && !(statusCode.toString().startsWith("2") || statusCode.toString().startsWith("3"))) {
//       msg = `Server response error (Code: ${statusCode})`;
//     } else {
//       msg = "Unknown error";
//     }
//   }

//   toast({
//     title: "Error",
//     description: msg,
//     variant: "destructive",
//   });
// }

// export function objAsRecord(obj: object): Record<string, any> {
//   return Object.entries(obj).reduce((acc, [key, value]) => {
//     if (value !== undefined && value !== null) {
//       acc[key] = value;
//     }
//     return acc;
//   }, {} as { [key: string]: any });
// }

// export function generateUUIDv4(): string {
//   return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//       const r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0,
//             v = c == 'x' ? r : (r & 0x3 | 0x8);
//       return v.toString(16);
//   });
// }