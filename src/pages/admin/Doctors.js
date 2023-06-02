import { message, Table } from 'antd';
import React, { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import axios from 'axios';

const Doctors = () => {

  const [doctors,setDoctors] = useState([]);

  const getDoctors = async () => {
    try {
      const res = await axios.get('/api/v1/admin/getAllDoctors',{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      if(res.data.success){
        setDoctors(res.data.data);
        message.success(res.data.message);
      }else{
        message.error('Couldnt get Doctors');
      }
      
    } catch (error) {
      console.log(error);
      message.error('Cant get Doctors');
    }
  }

  const handleDoctorStatus = async (record, status) => {
    try {
      const res = await axios.post('/api/v1/admin/changeAccountStatus',{
        doctorId: record._id,
        userId: record.userId,
        status: status
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        message.success(res.data.message);
        window.location.reload();
      }else{
        message.error('couldnt send doctor status');
      }
    } catch (error) {
      console.log(error);
      message.error('Wasnt able to change status');
    }
  }

  useEffect(() => {
    getDoctors();
  },[]);

  const columns = [
		{
			title: "Name",
			dataIndex: "name",
      render: (text,record) => (
        <span>{record.firstName} {record.lastName}</span>
      )
		},
		{
			title: "Status",
			dataIndex: "status",
		},
		{
			title: "Phone",
			dataIndex: "phone",
		},
		{
			title: "Actions",
			dataIndex: "actions",
			render: (text, record) => (
				<div className="d-flex">
					{record.status === 'pending' ?(<button className="btn btn-success" onClick={() => handleDoctorStatus(record,'approved')}>Approve</button>):(<button className="btn btn-danger">Reject</button>)}
				</div>
			),
		},
	];

  return (
    <Layout>

    <h1 className='text-center m-3'>Doctors</h1>
    <Table columns={columns} dataSource={
    doctors}/>
    </Layout>
  )
}

export default Doctors