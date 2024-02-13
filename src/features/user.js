import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import Cookies from 'js-cookie';

const REAL_API_URL = 'http://127.0.0.1:8000'
const initialState = {
	isAuthenticated: false,
	user: null,
	users:[],
	loading: false,
	registered: false,
	accessToken: null,
    refreshToken: null,
	error:""
};


export const register = createAsyncThunk(
	"users/register",
	async (payload) => {
	const response = await axios.post(`${REAL_API_URL}/api/users/register/`, payload, {
		headers: {
		"content-type": "multipart/form-data",
		},
	});
	  return response.data;
	}
);



export const getUsers = createAsyncThunk(
	'users/getUsers',
	async(_, thunkAPI) =>{
		const access =  Cookies.get('accessToken')
		try{
			const res = await fetch(`${REAL_API_URL}/api/users/allUsers/`,{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${access}`
				}
			});

			const data = await res.json();
			console.log("returned data: ", data);
			if (res.status === 200){
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch(err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
	)




	export const deleteUser = createAsyncThunk(
		'users/deleteUser',
		async (userId, thunkAPI) => {
		try {
			const access = Cookies.get('accessToken');
			const response = await axios.post(
			`${REAL_API_URL}/api/users/deleteUser/`,
			{ id: userId },
			{
				headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${access}`,
				},
			}
			);
	
			return response.data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response.data);
		}
		}
	);


const getUser = createAsyncThunk(
	'user/me',
	async(_, thunkAPI) =>{
		const access =  Cookies.get('accessToken')
		try{
			const res = await fetch(`${REAL_API_URL}/api/users/me/`,{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					Authorization: `Bearer ${access}`
				}
			});

			const data = await res.json();

			if (res.status === 200){
				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch(err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
	)

export const login = createAsyncThunk(
	'users/login',
	async ({email, password }, thunkAPI) => {
		const body = JSON.stringify({
			email,
			password,
		});

		try {
			const res = await fetch(`${REAL_API_URL}/api/token/`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
			});

			const data = await res.json();

			if (res.status === 200) {
				Cookies.set('accessToken', data.access, {expires: 7});
				Cookies.set('refreshToken', data.refresh, { expires: 7});

				const {dispatch} = thunkAPI;

				dispatch(getUser());

				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);
		}
	}
);


export const checkAuth = createAsyncThunk(
	'users/verify',
	async (_, thunkAPI) => {
		const access =  Cookies.get('accessToken')
		const body = JSON.stringify({
			token: access,
			
		});

		try {
			const res = await fetch(`${REAL_API_URL}/api/token/verify/`, {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body,
			});

			const data = await res.json();
			if (res.status === 200) {
				const {dispatch} = thunkAPI;

				dispatch(getUser());

				return data;
			} else {
				return thunkAPI.rejectWithValue(data);
			}
		} catch (err) {
			return thunkAPI.rejectWithValue(err.response.data);

		}
	}
);




export const logout = createAsyncThunk(
    'users/logout',
    async (_, thunkAPI) => {
        try {
            
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');

            const {dispatch} = thunkAPI;
            dispatch(resetUser());

            return 'Logout successful';
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);


const userSlice = createSlice({
name: 'user',
initialState,
reducers: {
    resetRegistered: state =>{
    state.registered = false;
    },
	resetUser: state => {
		state.isAuthenticated = false;
		state.user = null;
		state.accessToken = null;
		state.refreshToken = null;
	},
},
extraReducers: builder => {
    builder
    .addCase(register.pending, state =>{
        state.loading = true;
	})
	.addCase(register.fulfilled, state =>{
        state.loading = false;
        state.registered = true;
	})
	.addCase(register.rejected, state =>{
        state.loading = false;
	})
	.addCase(login.pending, state =>{
		state.loading = true;
	})
	.addCase(login.fulfilled, (state, action) =>{
		state.loading = false;
		state.isAuthenticated = true;
		state.accessToken = action.payload.accessToken
		state.refreshToken = action.payload.refreshToken

	})
	.addCase(login.rejected, state =>{
		state.loading = false;
	})
	.addCase(getUser.pending, state =>{
        state.loading = true;
	})
	.addCase(getUser.fulfilled, (state, action) =>{
        state.loading = false;
        state.user = action.payload;
	})
	.addCase(getUser.rejected, state =>{
        state.loading = false;
	})
	.addCase(checkAuth.pending, state =>{
		state.loading = true;
	})
	.addCase(checkAuth.fulfilled, state =>{
		state.loading = false;
		state.isAuthenticated = true;
	})
	.addCase(checkAuth.rejected, state =>{
		state.loading = false;
	})
	.addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
	})
	.addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
	})
	.addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
	})
	.addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
	})
	.addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
		const deletedUserId = action.payload.deleted_user_id;
        state.users = state.users.filter((user) => user.id !== deletedUserId);
	})
	.addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
	})
}
})

export const { resetRegistered, resetUser } = userSlice.actions
export default userSlice.reducer
