import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "interviewActive";
const EMPTY_INTERVIEW_STATE = {
  active: false,
  sessionId: null,
};

export const getInterviewSessionIdFromPath = (pathname) => {
  if (!pathname) return null;

  const match = pathname.match(/\/dashboard\/interview(?:\/session)?\/([^/]+)/);

  return match ? match[1] : null;
};

export const readStoredInterviewState = () => {
  if (typeof window === "undefined") {
    return EMPTY_INTERVIEW_STATE;
  }

  try {
    const rawValue = sessionStorage.getItem(STORAGE_KEY);

    if (!rawValue) {
      return EMPTY_INTERVIEW_STATE;
    }

    const parsed = JSON.parse(rawValue);

    if (parsed && typeof parsed === "object") {
      return {
        active: Boolean(parsed.active),
        sessionId: parsed.sessionId || null,
      };
    }

    return {
      active: rawValue === "true",
      sessionId: null,
    };
  } catch (error) {
    console.warn("Failed to parse interview state", error);

    return {
      active: sessionStorage.getItem(STORAGE_KEY) === "true",
      sessionId: null,
    };
  }
};

export const persistInterviewState = (state) => {
  if (typeof window === "undefined") {
    return;
  }

  const nextState = {
    active: Boolean(state?.active),
    sessionId: state?.sessionId || null,
  };

  if (nextState.active && nextState.sessionId) {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    return;
  }

  sessionStorage.removeItem(STORAGE_KEY);
};

const InterviewContext = createContext(null);

export const InterviewProvider = ({ children }) => {
  const [interviewState, setInterviewState] = useState(() =>
    readStoredInterviewState(),
  );

  const setActiveInterview = useCallback((sessionId) => {
    console.log("Interview active state changed", { active: true, sessionId });

    setInterviewState((prevState) => {
      if (prevState.active === true && prevState.sessionId === sessionId) {
        return prevState;
      }

      return {
        active: true,
        sessionId,
      };
    });
  }, []);

  const clearInterview = useCallback(() => {
    console.log("Interview active state changed", EMPTY_INTERVIEW_STATE);

    setInterviewState((prevState) => {
      if (prevState.active === false && prevState.sessionId === null) {
        return prevState;
      }

      return EMPTY_INTERVIEW_STATE;
    });
  }, []);

  useEffect(() => {
    console.log(
      "Interview active state persisted to sessionStorage",
      interviewState,
    );
    persistInterviewState(interviewState);
  }, [interviewState]);

  const value = useMemo(
    () => ({
      interviewState,
      setInterviewState,
      setActiveInterview,
      clearInterview,
    }),
    [interviewState, setActiveInterview, clearInterview],
  );

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterview = () => {
  const context = useContext(InterviewContext);

  if (!context) {
    throw new Error("useInterview must be used inside an InterviewProvider");
  }

  return context;
};
