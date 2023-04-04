import axios from 'axios';

const BASE_API_URL = "http://localhost:3001";

export const getApiInfo = async () => {
    const res = await axios.get(`${BASE_API_URL}/info`);
    return res.data;
};

export const getErgoNameRegistrationData = async (name) => {
    const res = await axios.get(`${BASE_API_URL}/resolve/${name}`);
    return res.data;
}