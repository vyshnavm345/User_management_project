import Layout from 'components/Layout'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {  update } from 'features/editUserSlice'
import { useNavigate } from 'react-router-dom'


function EditUser() {
    const {selectedUser} = useSelector(state=> state.edit)

    const [first_name, setFirstName] = useState(selectedUser.first_name)
    const [last_name, setLastName] = useState(selectedUser.last_name)
    const [email, setEmail] = useState(selectedUser.email)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleFirstName =(e)=>{
        setFirstName(e.target.value)
    }

    const handleSubmit = e =>{
        e.preventDefault();

        const id = selectedUser.id

        dispatch(update({ id, first_name, last_name, email}))

        navigate("/dashboard")

    }

  return (
    <Layout title='Auth Site | EditUser' content='Edit User'>
        <h1>Edit User</h1>
        <form className="mt-5" onSubmit={handleSubmit}>
            <div className="form-group">
                <label className="form-label" htmlFor="">First Name :</label>
                <input className="form-control" type="text" onChange={(e)=>{handleFirstName(e)}}  value={first_name}/>
            </div>
            <div className="form-group mt-3">
                <label className="form-label" htmlFor="">Last Name :</label>
                <input className="form-control" type="text" onChange={(e)=>{setLastName(e.target.value)}} value={last_name}/>
            </div>
            <div className="form-group mt-3">
                <label className="form-label" htmlFor="">Email :</label>
                <input className="form-control" type="email" onChange={(e)=>{setEmail(e.target.value)}} value={email} />
            </div>
            <div className='mt-3'>
            <button className='btn btn-sm btn-success'>Update</button>
            </div>
        </form>
    </Layout>
  )
}

export default EditUser