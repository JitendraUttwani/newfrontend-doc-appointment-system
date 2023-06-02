import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Row, Col, Form, Input, TimePicker, message } from "antd";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/features/alertSlice";
import dayjs from 'dayjs';

const Profile = () => {

  const {user} = useSelector(state => state.user);
  const [doctor,setDoctor] = useState();
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getDoctorInfo = async (req,res) => {
    try {
      const res = await axios.post('/api/v1/doctor/getDoctorInfo',{
        userId: params.id,
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      if(res.data.success){
        setDoctor(res.data.data);
        message.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error('getDoctorInfo func is not working')
    }
  }
  const handleFinish = async (values) => {
		try {
			dispatch(showLoading());
			const res = await axios.post(
				"/api/v1/doctor/updateProfile",
				{ ...values, userId: user?._id ,
          timings: [
            dayjs(values.timings[0]).format("HH:mm"),
            dayjs(values.timings[1]).format("HH:mm")
          ]
        },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
				}
			);
			dispatch(hideLoading());
			if (res.data.success) {
				message.success("Successfully applied doctor");
				navigate("/");
			} else {
				message.error(res.data.error);
			}
		} catch (err) {
			dispatch(hideLoading());
			console.log(err);
			message.error("Apply Doctor route went wrong");
		}
	};

  useEffect(() => {
    getDoctorInfo();
  },[]);

  return (
		<Layout>
			<h1>Manage Profile</h1>

			{doctor && (
				<Form
					layout="vertical"
					onFinish={handleFinish}
					className="m-3"
					initialValues={{
						...doctor,
						timings: [
							dayjs(doctor.timings[0],"HH:mm"),
							dayjs(doctor.timings[1],"HH:mm"),
						],
					}}
				>
					<h4>Personal Details :</h4>
					<Row gutter={20}>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="First Name"
								name="firstName"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your name" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Last Name"
								name="lastName"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your last name" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Phone No"
								name="phone"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your phone" />
							</Form.Item>
						</Col>

						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Email"
								name="email"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your email" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item label="Website" name="website">
								<Input type="text" placeholder="your website" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Address"
								name="address"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your address" />
							</Form.Item>
						</Col>
					</Row>
					<h4>Professional Details :</h4>
					<Row gutter={20}>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Specialization"
								name="specialization"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your specialization" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Experience"
								name="experience"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your experience" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Fees Per Consultation"
								name="feesPerConsultation"
								required
								rules={[{ required: true }]}
							>
								<Input type="text" placeholder="your fees" />
							</Form.Item>
						</Col>

						<Col xs={24} md={24} lg={8}>
							<Form.Item
								label="Timings"
								name="timings"
								required
								rules={[{ required: true }]}
							>
								<TimePicker.RangePicker format="HH:mm" />
							</Form.Item>
						</Col>
						<Col xs={24} md={24} lg={8}></Col>
						<Col xs={24} md={24} lg={8}>
							{/* <div className="d-flex justify-content-end"> */}
								<button className="btn btn-primary form-btn" type="submit">
									Update
								</button>
							{/* </div> */}
						</Col>
					</Row>
				</Form>
			)}
		</Layout>
	);
}

export default Profile