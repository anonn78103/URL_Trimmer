import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { CheckCircle, Loader } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const name = searchParams.get('name');
  const email = searchParams.get('email');
  const avatar = searchParams.get('avatar');
  const isPremium = searchParams.get('isPremium') === 'true';
  const error = searchParams.get('error');

  if (error){
    navigate('/login?error=oauth_failed');
    return;} 

  // if (error) {
  //   navigate('/login?error=oauth_failed', { replace: true });
  //   return;
  // }

  if (token && userId) {
    const userData = {
      _id: userId,
      name: decodeURIComponent(name || ''),
      email: decodeURIComponent(email || ''),
      avatar: decodeURIComponent(avatar || ''),
      isPremium,
      token
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);

    setUser(userData);

    // Defer navigation until after state update
    setTimeout(() => {navigate('/dashboard', { replace: true })},1500);
  } else {
    navigate('/login', { replace: true });
  }
}, [searchParams, navigate, setUser]);


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mx-auto h-20 w-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-10 w-10 text-white" />
        </motion.div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Authentication Successful!
        </h2>

        <p className="text-gray-600 mb-6">
          Redirecting you to your dashboard...
        </p>

        <div className="flex justify-center">
          <Loader className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
      </div>
    </motion.div>
  );
};

export default AuthCallback;

