import React from 'react';
import { Link,useNavigate } from "react-router-dom";
import { Form, Input, message } from "antd";
import { useDispatch } from 'react-redux';
import { showLoading,hideLoading } from '../redux/features/alertSlice';
import axios from 'axios';


const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinishHandler = async (values) => {
    try{
      dispatch(showLoading());
      const res = await axios.post('/api/v1/user/login',values);
      window.location.reload();
      dispatch(hideLoading());
      console.log(res);
      if(res.data.success){
        message.success(res.data.message);
        localStorage.setItem('token',res.data.token);
        navigate('/');
      }else{
        message.error(res.data.message);
      }
    }catch(err){
      dispatch(hideLoading());
      console.log(err);
      message.error(`OnFinish Handler Not working ${err}`);
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
          <h3 className='text-center'>Login form</h3>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Link to="/register" className="m-2">
            Register here
          </Link>
          <button className="btn btn-primary" type="submit">
            Login
          </button>
        </Form>
      </div>
    </>
  );
};

export default Login;