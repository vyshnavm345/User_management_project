import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Cookies from 'js-cookie';

const REAL_API_URL = 'http://127.0.0.1:8000'

const initialState = {
	selectedUser: '',
	loading: false,
	error:""
};


export const update = createAsyncThunk(
	'edit/update',
	async({id, first_name, last_name, email}, thunkAPI) =>{
		const access =  Cookies.get('accessToken')
        const body = JSON.stringify({
			"id": id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email
		});
		try{
			const res = await fetch(`${REAL_API_URL}/api/users/updateUser/`,{
				method: 'PUT',
				headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
					Authorization: `Bearer ${access}`
				},
                body
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


export const editSlice = createSlice({
    name: 'edit',
    initialState,
    reducers: {
        updateUser: (state, action) =>{
        state.selectedUser = action.payload;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(update.pending, state =>{
            state.loading = true;
            state.error = "";
        })
        .addCase(update.fulfilled, state =>{
            state.loading = false;
            state.error = "";
        })
        .addCase(update.rejected, (state, action) =>{
            state.loading = false;
            state.error = action.error.message;
        })
    }
})

export const { updateUser } = editSlice.actions
export default editSlice.reducer
