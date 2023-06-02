import { message, Table } from "antd";
import React, { useEffect, useState } from "react";
import Layout from "../../components/Layout";
import axios from "axios";

const Users = () => {
	const [users, setUsers] = useState([]);

	const getUsers = async () => {
		try {
			const res = await axios.get("/api/v1/admin/getAllUsers", {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("token")}`,
				},
			});
			if (res.data.success) {
				setUsers(res.data.data);
				message.success(res.data.message);
			} else {
				message.error("Couldnt get Users");
			}
		} catch (error) {
			console.log(error);
			message.error("Cant get Users");
		}
	};

	useEffect(() => {
		getUsers();
	}, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Email',
      dataIndex: 'email'
    },
    {
      title: 'Doctor',
      dataIndex: 'isDoctor',
      render: (text,record) => 
        <span>{record.isDoctor ? 'Yes': 'No'}</span>
      
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      render: (text,record) => 
        <div className="d-flex">
          <button className="btn btn-danger">
            Block
          </button>
        </div>
      
    },
  ]

	return (
		<Layout>
			<h1 className="text-center m-2">Users</h1>
      <Table columns={columns} dataSource={users}/>
		</Layout>
	);
};

export default Users;
