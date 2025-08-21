'use client'
import axios from 'axios';

export const userServiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_USER_SERVICE_API_BASE_URL, 
  withCredentials: true, 
});


export const jobServiceApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_JOB_SERVICE_API_BASE_URL, 
  withCredentials: true, 
});