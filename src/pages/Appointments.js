import { message, Table, Tabs } from 'antd';
import axios from 'axios';
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import Layout from '../components/Layout'
import { hideLoading, showLoading } from '../redux/features/alertSlice';

const Appointments = () => {

  const dispatch = useDispatch();
  const [appointments,setAppointments] = useState([]);

  const columns = [
		{
			title: "ID",
			dataIndex: "_id",
		},
		{
			title: "Name",
			dataIndex: "name",
			render: (text, record) => {
				<span>
					{record.doctorInfo.firstName} 
					{record.doctorInfo.lastName}
				</span>;
			},
		},
		{
			title: "Phone",
			dataIndex: "phone",
			render: (text, record) => {
				<span>
					{record.doctorInfo.phone}
				</span>;
			},
		},
		{
			title: "Date & Time",
			dataIndex: "date",
			render: (text, record) => <span>{moment(record.date).format('DD-MM-YYYY')} &nbsp;
      {moment(record.time).format('HH:mm')}
        </span>,
		},
		{
			title: "Status",
			dataIndex: "status",
		},
	];


  const getUserAppointments = async () => {
		try {
			dispatch(showLoading);
			const res = await axios.get(
				"/api/v1/user/user-appointments",
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);
			dispatch(hideLoading);
			if (res.data.success) {
        setAppointments(res.data.data);
				message.success(res.data.message);
			} else {
			  message.success(res.data.message);
			}
		} catch (err) {
			dispatch(hideLoading);
			console.log(err);
			message.error("Not working properly");
		}
	};

  useEffect(() => {
    getUserAppointments();
  },[])

  return (
    <Layout>
    <h1>Appointments</h1>
    <Table columns={columns} dataSource={appointments}/>
    </Layout>
  )
}

export default Appointments