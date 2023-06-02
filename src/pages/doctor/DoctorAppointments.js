import { message, Table, Tabs } from "antd";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";


const DoctorAppointments = () => {

	const dispatch = useDispatch();
	const [appointments, setAppointments] = useState([]);


	const columns = [
		{
			title: "ID",
			dataIndex: "_id",
		},
		// {
		// 	title: "Name",
		// 	dataIndex: "name",
		// 	render: (text, record) => {
		// 		<span>
		// 			{record.doctorInfo.firstName}
		// 			{record.doctorInfo.lastName}
		// 		</span>;
		// 	},
		// },
		// {
		// 	title: "Phone",
		// 	dataIndex: "phone",
		// 	render: (text, record) => {
		// 		<span>{record.doctorInfo.phone}</span>;
		// 	},
		// },
		{
			title: "Date & Time",
			dataIndex: "date",
			render: (text, record) => (
				<span>
					{moment(record.date).format("DD-MM-YYYY")} &nbsp;
					{record.time}
				</span>
			),
		},
		{
			title: "Status",
			dataIndex: "status",
		},
		{
			title: "Actions",
			dataIndex: "actions",
			render: (text, record) => (
				<div className="d-flex">
					{record.status === "pending" && (
						<div className="d-flex">
							<button
								className="btn btn-success"
								onClick={() => handleStatus(record,"approved")}
							>
								Approve
							</button>
							<button
								className="btn btn-danger ms-2"
								onClick={() => handleStatus(record,"rejected")}
							>
								Reject
							</button>
						</div>
					)}
				</div>
			),
		},
	];

	const getDoctorAppointments = async () => {
		try {
			dispatch(showLoading);
			const res = await axios.get("/api/v1/doctor/doctor-appointments", {
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
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
		getDoctorAppointments();
	}, []);

  const handleStatus = async (record,status) => {
    try {
      const res = await axios.post('/api/v1/doctor/update-status',{
        appointmentId: record._id,
        status
      },{
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token'
          )}`
        }
      });
      if(res.data.success){
        message.success(res.data.message);
        getDoctorAppointments();
      }
      
    } catch (error) {
      console.log(error);
      message.error('Not handling status properly')
    }
  };


  return (
		<Layout>
			<h1>DoctorAppointments</h1>
			<Table columns={columns} dataSource={appointments} />
		</Layout>
	);
}

export default DoctorAppointments