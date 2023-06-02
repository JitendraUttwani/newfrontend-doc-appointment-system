import React from 'react';
import {Form, Input, message} from 'antd';
import '../styles/RegisterStyle.css';
import { Link,useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';

const Register = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinishHandler = async (values) =>{
    try{
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/register',values);
      dispatch(hideLoading());
      console.log(res);
      if(res.data.success){
        message.success('Registered Successfully');
        navigate('/login');
      }else{
        message.error(res.data.message);
      }
      }
    catch(err){
      dispatch(hideLoading());
      console.log(err);
      message.error('Cant register');
    }
  };
  return (
    <>
      <div className="form-container">
        <Form
          layout="vertical"
          onFinish={onFinishHandler}
          className="register-form"
        >
          <h3 className='text-center'>Register form</h3>
          <Form.Item label="Name" name="name">
            <Input type="name" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/login" className="m-2">
            Already logged in
          </Link>
          <button className="btn btn-primary" type="submit">
            Submit
          </button>
        </Form>
      </div>
    </>
  );
};

export default Register;