import { createContext, useEffect, useState } from 'react';
import { makeRequest } from '../axios';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  const update = async (userId) => {
    const res = await makeRequest.get(`/users/find/${userId}`);
    console.log('----res', res);
    setCurrentUser(res);
  };

  const login = async (inputs) => {
    const res = await makeRequest.post('/auth/login', inputs);
    setCurrentUser(res.data);
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, update }}>
      {children}
    </AuthContext.Provider>
  );
};
