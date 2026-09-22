import { feedback } from "../lib/proxy.mjs";

export default feedback;

export const config = {
  path: "/api/feedback",
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
