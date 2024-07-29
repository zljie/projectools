import React, { useReducer, createContext, useContext, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// 创建上下文
const ProjectContext = createContext();

// reducer函数
const projectReducer = (state, action) => {
  switch (action.type) {
    case "SET_INITIAL_STATE":
      return {
        ...state,
        ...action.payload,
      };
    case "UPDATE_PROJECT":
      return {
        ...state,
        project: { ...state.project, ...action.payload },
      };
    case "ADD_MILESTONE":
      return {
        ...state,
        milestones: [...state.milestones, action.payload],
      };
    case "UPDATE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.map((milestone) =>
          milestone.MilestoneId === action.payload.MilestoneId
            ? { ...milestone, ...action.payload }
            : milestone
        ),
      };
    case "DELETE_MILESTONE":
      return {
        ...state,
        milestones: state.milestones.filter(
          (milestone) => milestone.MilestoneId !== action.payload
        ),
      };
    default:
      return state;
  }
};

// 提供者组件
export const ProjectProvider = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, {
    project: {},
    milestones: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialData = async () => {
      const response = await fetch("/example.json");
      const data = await response.json();
      dispatch({ type: "SET_INITIAL_STATE", payload: data });
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProjectContext.Provider value={{ state, dispatch }}>
      {children}
    </ProjectContext.Provider>
  );
};

// 自定义钩子
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject must be used within a ProjectProvider");
  }
  return context;
};
