import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
  try {
    const res = await axios.get(
      "https://v3.football.api-sports.io/fixtures?live=all",
      {
        headers: {
          "x-apisports-key": process.env.API_KEY,
        },
      }
    );
    console.log(res.data);
  } catch (e) {
    console.log(e.response?.data || e.message);
  }
};

test();