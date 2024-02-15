import axios from "axios";

const BASE_API_URL = "http://54.183.62.198:3001";

export async function getApiInfo() {
  const res = await axios.get(`${BASE_API_URL}/info`);
  if (res.status != 200) {
    return null;
  }
  return res.data;
}

export async function resolveErgoname(name) {
  const res = await axios.get(`${BASE_API_URL}/resolve/${name}`);
  if (res.status != 200) {
    return null;
  }
  return res.data;
}

export async function ergonameOwner(name) {
  const res = await axios.get(`${BASE_API_URL}/owner/${name}`);
  if (res.status != 200) {
    return null;
  }
  return res.data;
}
