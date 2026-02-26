// essa somente em throw new, não entra em try/catch
// export class HttpError extends Error {
//   constructor(
//     message: string,
//     public readonly statusCode: number,
//     public readonly details?: Record<string, unknown>,
//   ) {
//     super(message);
//     this.statusCode = statusCode
//     this.details = details
//     this.name = "HttpError";
//   }
// }

export const getErrorMessage = async (error: unknown) => {
    const message = error instanceof Error ? error.message : "Unexpected error";    
    return message;
}