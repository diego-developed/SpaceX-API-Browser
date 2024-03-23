import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, Button } from '@mui/material';

function PayloadDetails() {
    const { id } = useParams();
    const [payloadDetails, setPayloadDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    useEffect(() => {
      const fetchPayloadDetails = async () => {
        try {
          const response = await axios.get(`https://api.spacexdata.com/v4/payloads/${id}`);
          setPayloadDetails(response.data);
          setError(false);
        } catch (error) {
          console.error("Failed to fetch payload details", error);
          setError(true);
        } finally {
          setLoading(false);
        }
      };
      fetchPayloadDetails();
    }, [id]);
  
    if (loading) {
      return <Typography gutterBottom variant="h6" component="div">Loading payload details...</Typography>;
    }
  
    if (error || !payloadDetails) {
      return <Typography gutterBottom variant="h6" component="div">Payload not found.</Typography>;
    }

    const launchId = payloadDetails.launchId;

  return (
    <Card sx={{ maxWidth: 600, margin: 'auto' }}>
      <CardContent>
        <ul>
        <Typography gutterBottom variant="h5" component="div">
          <li>Payload Name: {payloadDetails.name}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Payload Type: {payloadDetails.type || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Payload Mass: {payloadDetails.mass_kg ? `${payloadDetails.mass_kg} kg` : "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <li>Orbit: {payloadDetails.orbit || "N/A"}</li>
        </Typography>
        <Typography variant="body2" color="text.secondary" style={{ marginTop: '10px' }}>
        <li>Associated Launch: <Link to={`/launches/${payloadDetails.launch}`}>Launch Details</Link></li>
        </Typography>
        <li><Button variant="contained" component={Link} to="/payloads/page/0" style={{ marginTop: '20px' }}>
          Back to all payloads
        </Button>
        </li>
        </ul>
      </CardContent>
    </Card>
  );
}

export default PayloadDetails;
