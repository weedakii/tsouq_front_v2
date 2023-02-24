import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MetaData from '../layout/MetaData';
import { clearErrors } from '../../actions/orderAction';
import { Button } from '@mui/material';
import { DELETE_USER_RESET } from '../../constants/userConst';
import { deleteUser, getAllUsers } from '../../actions/userAction';
import CloseIcon from '@mui/icons-material/Close';
import SortIcon from '@mui/icons-material/Sort';

const AdminUsers = () => {
    const [open, setOpen] = useState(false)
    const handleOpen = () => {
        setOpen(!open)
    }

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const { error, users} = useSelector(state => state.allUsers)
    const { error: deleteError, isDeleted, message} = useSelector(state => state.updateUser)

    const deleteOrderHundler = (id) => {
        dispatch(deleteUser(id))
    }
    const columns= [
        {field: "id", headerName: "User ID", minWidth: 270, flex: 1},
        {field: "email", headerName: "Email", minWidth: 200, flex: 0.5},
        {field: "name", headerName: "Name", minWidth: 130, flex: 0.3},
        {
            field: "role", headerName: "Role", minWidth: 120, flex: 0.3,
            cellClassName: (params) => {
                return params.getValue(params.id, "role") === "admin" ? "text-green-700" : "text-red-700";
            }
        },
        {
            field: "open", headerName: "Open", minWidth: 120, 
            type: "number", flex: 0.3, sortable: false,
            renderCell: (params) => {
                return (
                    <>
                    <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button color='error' onClick={() => deleteOrderHundler(params.getValue(params.id, "id"))}>
                        <DeleteIcon />
                    </Button>
                    </>
                )
            }
        },
    ]
    const rows= []
    users && users.forEach((e, i) => {
        rows.push({
            id: e._id,
            role: e.role,
            email: e.email,
            name: e.name
        })
    })

    useEffect(() => {
        const fetchData = () => {
            if (window.innerWidth > 600 ) {
                setOpen(true)
            }
            if (error) {
                alert.error(error)
                dispatch(clearErrors())
            }
            if (deleteError) {
                alert.error(deleteError)
                dispatch(clearErrors())
            }
            if (isDeleted) {
                alert.success(message)
                navigate(`/admin/users`)
                dispatch({type: DELETE_USER_RESET})
            }
            dispatch(getAllUsers())
        }
        fetchData()
    }, [dispatch, error, alert, deleteError, isDeleted, navigate, message])
  return (
    <>
        <MetaData title="الادمن - جميع المستخدمين" />
        <div className="flex-1 sm:grid-cols-sid grid-cols-1 grid p-2 w-screen max-w-[100%]">
            <div className="relative sm:max-w-[250px] sm:min-w-[200px] z-10 bg-white">
                <div className='sm:hidden'>
                    <Button onClick={handleOpen} >
                    {
                        open ? <CloseIcon fontSize='large' color='error' /> 
                        : <SortIcon fontSize='large' color='info' />
                    }
                    </Button>

                </div>
                <div className={`${open ? 'block' : 'hidden'}`}>
                    <Sidebar />
                </div>
            </div>
            <div className="p-1 mx-auto w-full">
                <h2 className="text-center font-bold text-3xl mb-10 mt-5 text-slate-700">جميع المستخدمين</h2>
                <DataGrid 
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    autoHeight
                    disableSelectionOnClick
                />
            </div>
        </div>
    </>
  )
}

export default AdminUsers