import express from "express"
import cors from "cors"
import {findResults } from "./utils.js";
import dotenv from 'dotenv'

dotenv.config()

const app = express();
const PORT = process.env.PORT || 3400;

// Use the CORS middleware
app.use(cors());

app.get('/api/search-rivers', async (req, res) => {
  const { lat, lng } = req.query;
//   console.log(lat, lng)
  try {
    const resp = await findResults(lat,lng) 
    return res.json(resp)
  } catch (error) {
    res.status(500).json({ error: error.message });
  }

});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
