import { HttpResponse, http } from "msw";

export const handlers = [
  http.get("/api/user", ({ request }) => {
    return HttpResponse.json({ username: "admin" });
  }),
];
