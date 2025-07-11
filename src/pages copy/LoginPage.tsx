import React from "react";
import Login from "../components/Login"; // 이미 만든 Login 컴포넌트 불러오기

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign in to your account</h2>
        <Login />
      </div>
    </div>
  );
  
};

export default LoginPage;