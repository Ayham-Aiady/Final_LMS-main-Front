import axios from 'axios';

export const getEnrolledCourses = async (userId) => {
  const res = await axios.get(`/api/enrollments/user/${userId}/with-courses`);
  return res.data;
};
