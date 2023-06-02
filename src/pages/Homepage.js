import { message, Row } from 'antd';
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import DoctorsList from '../components/DoctorsList';
import Layout from '../components/Layout';


const Homepage = () => {
  
  const [doctors,setDoctors] = useState([]);
  // const getUserData = async () =>{
  //   try{
  //     const res = await axios.post('/api/v1/user/getUserData',{},{
  //       headers: {
  //         Authorization: 'Bearer ' + localStorage.getItem('token')
  //       }
  //     });
  //     message.success('Successfully send token');
  //   }catch(err){
  //     console.log(err);
  //     message.error('could not send token');
  //   }

  // }
  const getDoctorsData = async () => {
		try {
			const res = await axios.get(
				"/api/v1/user/getAllDoctors",
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);
			if(res.data.success){
        message.success(res.data.message);
        setDoctors(res.data.data);
      }
		} catch (err) {
			console.log(err);
			message.error("could not send token");
		}
	};
  useEffect(() => {
    getDoctorsData();
  },[]);

  return (
		<Layout>
			<h1 className='text-center'>Homepage</h1>
      <Row>
        {doctors && doctors.map(doctor => (
          <DoctorsList doctor={doctor}/>
        ))}
      </Row>
		</Layout>
	);
}

export default Homepage