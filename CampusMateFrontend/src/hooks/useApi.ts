import { useState, useCallback } from 'react';
import { ApiResponse, authAPI, courseAPI, userAPI, projectAPI, subjectAPI, queryAPI, Course, User, Project, Subject, Query } from '../lib/api';

export interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<void>;
  reset: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<ApiResponse<T>>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]) => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const response = await apiFunction(...args);
        setState({
          data: response.data,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specific hooks for each API section
export function useAuth() {
  const login = useApi<any>(authAPI.login);
  const register = useApi<any>(authAPI.register);
  const health = useApi<any>(authAPI.health);

  return { login, register, health };
}

export function useCourses() {
  const getAll = useApi<Course[]>(courseAPI.getAll);
  const getById = useApi<Course>(courseAPI.getById);
  const create = useApi<Course>(courseAPI.create);
  const update = useApi<Course>(courseAPI.update);
  const deleteCourse = useApi<void>(courseAPI.delete);

  return { getAll, getById, create, update, delete: deleteCourse };
}

export function useUsers() {
  const getAll = useApi<User[]>(userAPI.getAll);
  const getById = useApi<User>(userAPI.getById);
  const getProfile = useApi<User>(userAPI.getProfile);
  const updateProfile = useApi<User>(userAPI.updateProfile);
  const deleteUser = useApi<void>(userAPI.delete);

  return { getAll, getById, getProfile, updateProfile, delete: deleteUser };
}

export function useProjects() {
  const getAll = useApi<Project[]>(projectAPI.getAll);
  const getById = useApi<Project>(projectAPI.getById);
  const create = useApi<Project>(projectAPI.create);
  const update = useApi<Project>(projectAPI.update);
  const deleteProject = useApi<void>(projectAPI.delete);
  const join = useApi<Project>(projectAPI.join);
  const leave = useApi<void>(projectAPI.leave);

  return { getAll, getById, create, update, delete: deleteProject, join, leave };
}

export function useSubjects() {
  const getAll = useApi<Subject[]>(subjectAPI.getAll);
  const getById = useApi<Subject>(subjectAPI.getById);
  const create = useApi<Subject>(subjectAPI.create);
  const update = useApi<Subject>(subjectAPI.update);
  const deleteSubject = useApi<void>(subjectAPI.delete);

  return { getAll, getById, create, update, delete: deleteSubject };
}

export function useQueries() {
  const getAll = useApi<Query[]>(queryAPI.getAll);
  const getById = useApi<Query>(queryAPI.getById);
  const create = useApi<Query>(queryAPI.create);
  const update = useApi<Query>(queryAPI.update);
  const deleteQuery = useApi<void>(queryAPI.delete);
  const upvote = useApi<void>(queryAPI.upvote);
  const downvote = useApi<void>(queryAPI.downvote);

  return { getAll, getById, create, update, delete: deleteQuery, upvote, downvote };
}
