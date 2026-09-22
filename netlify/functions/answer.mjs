import { answer } from "../lib/proxy.mjs";

export default answer;

export const config = {
  path: "/api/answer",
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
