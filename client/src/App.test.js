import {
  persistInterviewState,
  readStoredInterviewState,
} from "./context/InterviewContext";

describe("interview state persistence", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  test("restores an active interview from sessionStorage", () => {
    sessionStorage.setItem(
      "interviewActive",
      JSON.stringify({ active: true, sessionId: "session-123" }),
    );

    expect(readStoredInterviewState()).toEqual({
      active: true,
      sessionId: "session-123",
    });
  });

  test("removes the stored interview state when the interview is cleared", () => {
    persistInterviewState({ active: false, sessionId: null });

    expect(sessionStorage.getItem("interviewActive")).toBeNull();
  });
});
