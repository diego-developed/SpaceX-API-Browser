import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Typography, Card, CardContent, CardMedia, Button } from '@mui/material';
import noImage from '../assets/no-image.svg';

function LaunchDetails() {
  const { id } = useParams();
  const [launchDetails, setLaunchDetails] = useState(null);
  const [payloadDetails, setPayloadDetails] = useState([]);
  const [coreDetails, setCoreDetails] = useState([]);
  const [rocketName, setRocketName] = useState('');
  const [launchpadName, setLaunchpadName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [shipDetails, setShipDetails] = useState([]);

  useEffect(() => {
      const fetchLaunchDetails = async () => {
          try {
              const response = await axios.get(`https://api.spacexdata.com/v4/launches/${id}`);
              setLaunchDetails(response.data);
              setError(false);

              if (response.data.payloads) {
                  const payloadPromises = response.data.payloads.map(payloadId =>
                      axios.get(`https://api.spacexdata.com/v4/payloads/${payloadId}`)
                  );

                  const payloadResponses = await Promise.all(payloadPromises);
                  const payloadsData = payloadResponses.map(res => res.data);
                  setPayloadDetails(payloadsData);
              }
              if (response.data.cores) {
                const corePromises = response.data.cores.map(core => {
                  return axios.get(`https://api.spacexdata.com/v4/cores/${core.core}`);
                });
      
                const coreResponses = await Promise.all(corePromises);
                const coresData = coreResponses.map((res, index) => ({
                  ...res.data, 
                  coreId: response.data.cores[index].core 
                }));
                setCoreDetails(coresData);
              }
              if (response.data.ships && response.data.ships.length > 0) {
                const shipPromises = response.data.ships.map(shipId =>
                    axios.get(`https://api.spacexdata.com/v4/ships/${shipId}`)
                );

                const shipResponses = await Promise.all(shipPromises);
                const shipsData = shipResponses.map(res => res.data);
                setShipDetails(shipsData); 
              }
              if (response.data.rocket) {
                const rocketResponse = await axios.get(`https://api.spacexdata.com/v4/rockets/${response.data.rocket}`);
                setRocketName(rocketResponse.data.name); 
              }
              if (response.data.launchpad) {
                const launchpadResponse = await axios.get(`https://api.spacexdata.com/v4/launchpads/${response.data.launchpad}`);
                setLaunchpadName(launchpadResponse.data.name); 
              }
              
          } catch (error) {
              console.error("Failed to fetch launch details", error);
              setError(true);
          } finally {
              setLoading(false);
          }
      };
      fetchLaunchDetails();
  }, [id]);

  if (loading) {
      return <Typography gutterBottom variant="h6" component="div">Loading launch details...</Typography>;
  }

  if (error || !launchDetails) {
      return <Typography gutterBottom variant="h6" component="div">Launch not found.</Typography>;
  }

    return (
      <Card sx={{ maxWidth: 600, margin: 'auto' }}>
        <CardMedia
          component="img"
          height="300"
          image={launchDetails.links.patch.large || noImage}
          alt="Launch patch"
          sx={{ height: 300, objectFit: 'contain' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {launchDetails.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {launchDetails.details || "No details available."}
          </Typography>
          {launchDetails.links.webcast && (
            <iframe
              className="video"
              width="560"
              height="315"
              src={launchDetails.links.webcast.replace("watch?v=", "embed/")}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
          
          <ul>
          {payloadDetails.length > 0 && (
                <>
                <li>
                <Typography variant="body2" color="text.secondary">
                  Payloads:
                  </Typography>
                    {payloadDetails.map((payload, index) => (
                    <React.Fragment key={payload.id}>
                      <Link to={`/payloads/${payload.id}`}>{payload.name}</Link>
                      {index < payloadDetails.length - 1 ? <span className="boldComma"> , </span> : ''}
                    </React.Fragment>
                  ))}
                  </li>
                </>
            )}
          
          {coreDetails.length > 0 && (
                <>
                  <li>
                  <Typography variant="body2" color="text.secondary">
                    Cores:
                    </Typography>
                    {coreDetails.map((core, index) => (
                    <React.Fragment key={core.id}>
                      <Link to={`/cores/${core.id}`}>{core.serial}</Link>
                      {index < coreDetails.length - 1 ? <span className="boldComma"> , </span> : ''}
                    </React.Fragment>
                  ))}
                  </li>
                </>
            )}

      
            {launchDetails.rocket && (
              <li>
                <Typography variant="body2" color="text.secondary">
                Rocket:
                </Typography>
                <Link to={`/rockets/${launchDetails.rocket}`}>{rocketName}</Link>
              </li>
            )}
            {shipDetails.length > 0 && (
                <>
                  <li>
                  <Typography variant="body2" color="text.secondary">
                    Ships:
                    </Typography>
                    {shipDetails.map((ship, index) => (
                    <React.Fragment key={ship.id}>
                      <Link to={`/ships/${ship.id}`}>{ship.name}</Link>
                      {index < shipDetails.length - 1 ? <span className="boldComma"> , </span> : ''}
                    </React.Fragment>
                  ))}
                  </li>
                </>
            )}
             {launchDetails.launchpad && (
              <li>
              <Typography variant="body2" color="text.secondary">
              LaunchPad:
              </Typography>
              <Link to={`/launchpads/${launchDetails.launchpad}`}>{launchpadName}</Link>
            </li>
          )}
          <li><Button variant="contained" component={Link} to="/launches/page/0" style={{ marginTop: '20px' }}>
          Back to all launches
          </Button>
          </li>

          </ul>
        </CardContent>
      </Card>
    );
}

export default LaunchDetails;
