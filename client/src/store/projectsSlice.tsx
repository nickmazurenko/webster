import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAllProjects } from '../pages/tools/utils/fetchProjects';

export type Project = {
  title: string;
  thumbnail?: string;
  project: string;
  id: number;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
};

type projectsState = {
  collections: [];
  loading: boolean;
  projects: Project[];
  currentProject: Project;
  error: string | null;
};

const initialState: projectsState = {
  collections: [],
  projects: [],
  loading: false,
  currentProject: { title: '', project: '', id: -1 },
  error: null,
};

export const fetchProjectsAsync = createAsyncThunk<Project[], string>(
  'projects/fetchProjects',
  async (accessToken: string, thunkAPI) => {
    try {
      const { response, json } = await fetchAllProjects(accessToken);
      return json.data as unknown as Project[];
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch projects');
    }
  }
);
const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    createProject: (state, action: PayloadAction<Project>) => {
      console.log(action.payload);
      state.projects = [...state.projects, action.payload];
    },

    retrieveProject: (state, action: PayloadAction<Project>) => {
      state.currentProject = action.payload;
    },

    retrieveAllProjects: (state, action: PayloadAction<Project[]>) => {
      state.projects = action.payload;
    },
    clearAllProjects: (state) => {
      state.projects = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjectsAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjectsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload as unknown as Project[];
      })
      .addCase(fetchProjectsAsync.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { createProject, retrieveAllProjects, retrieveProject, clearAllProjects } =
  projectsSlice.actions;

export default projectsSlice.reducer;
