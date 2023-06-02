import { DatePicker, message, Row, TimePicker } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";



const BookingPage = () => {
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.user);
  const [doctor,setDoctor] = useState([]);
  const params = useParams();
  const [date,setDate] = useState("");
  const [time,setTime] = useState();
  const [isAvailable,setIsAvailable] = useState(false);
  const getDoctorsData = async () => {
		try {
			const res = await axios.post("/api/v1/doctor/getDoctorById",{
        doctorId: params.doctorId
      } ,{
				headers: {
					Authorization: "Bearer " + localStorage.getItem("token"),
				},
			});
			if (res.data.success) {
				message.success(res.data.message);
				setDoctor(res.data.data);
			}
		} catch (err) {
			console.log(err);
			message.error("could not send token");
		}
	};
  const handleAppointment = async () => {
		try {
      setIsAvailable(true);
      if(!date & !time){
        return alert('Date and time required');
      }
      dispatch(showLoading);
			const res = await axios.post(
				"/api/v1/user/book-appointment",
				{
					userId: user._id,
          doctorId: params.doctorId,
          userInfo: user,
          doctorInfo: doctor,
          date: date,
          time: time,
				},
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);
      dispatch(hideLoading);
			if (res.data.success) {
				message.success(res.data.message);
			}
		} catch (err) {
      dispatch(hideLoading);
			console.log(err);
			message.error("could not book appointment");
		}
	};

  const handleAvailability = async () => {
		try {
			dispatch(showLoading);
			const res = await axios.post(
				"/api/v1/user/booking-availability",
				{
					doctorId: params.doctorId,
					date: date,
					time: time,
				},
				{
					headers: {
						Authorization: "Bearer " + localStorage.getItem("token"),
					},
				}
			);
			dispatch(hideLoading);
			if (res.data.success) {
        setIsAvailable(true)
				message.success(res.data.message);
			}else{
        message.sucess(res.data.message);
      }
		} catch (err) {
			dispatch(hideLoading);
			console.log(err);
			message.error("Not working properly");
		}
	};

	useEffect(() => {
		getDoctorsData();
	}, []);

  return (
		<Layout>
			<h3>BookingPage</h3>
			<div className="container m-2">
				{doctor && (
					<div>
						<h4>
							Dr.{doctor.firstName} {doctor.lastName}
						</h4>
						<h4>Fees : {doctor.feesPerConsultation}</h4>
						<h4>
							Timings : {doctor.timings[0]} - {doctor.timings[1]}
						</h4>
						<div className="d-flex flex-column w-50">
							<DatePicker
								aria-required={"true"}
								className="m-2"
								format="DD-MM-YYYY"
								onChange={(value) => {
									setDate(moment(value).format("DD-MM-YYYY"));
									setIsAvailable(true);
								}}
							/>
							<TimePicker
								aria-required={"true"}
								className="mt-3"
								format="HH:mm"
								onChange={(value) => {
									setTime(moment(value).format("HH:mm"));
									setIsAvailable(true);
								}}
							/>
							<button
								className="btn btn-primary mt-2"
								onClick={handleAvailability}
							>
								Check Availability
							</button>
							<button className="btn btn-dark mt-2" onClick={handleAppointment}>
								Book Now
							</button>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

export default BookingPage