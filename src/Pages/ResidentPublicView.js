import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Loader, Title, Text, Center, Image, Box } from "@mantine/core";
import { publicRequest } from "../RequestMethod";

const defaultImage = '/assets/default-avatar.png';

const ResidentPublicView = () => {
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResident = async () => {
      try {
        console.log('Fetching resident with ID:', id);
        const res = await publicRequest.get(`/residents/public/${id}`);
        console.log('Resident data:', res.data);
        setResident(res.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching resident:', error);
        setError(error.response?.data?.message || 'Failed to fetch resident data');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResident();
    }
  }, [id]);

  if (loading) return <Center style={{ minHeight: 200 }}><Loader color="green" size="xl" /></Center>;
  if (error) return <Center><Text color="red" size="lg" weight={500}>{error}</Text></Center>;
  if (!resident) return <Center><Text color="red" size="lg" weight={500}>Resident not found.</Text></Center>;

  return (
    <Box 
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2E7D32 0%, #1B5E20 100%)",
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Paper 
        p="xl" 
        shadow="lg" 
        radius="lg" 
        style={{ 
          minWidth: 320, 
          maxWidth: 500,
          width: "100%",
          backgroundColor: "rgba(255, 255, 255, 0.95)"
        }}
      >
        {resident.image && (
          <Center mb="xl">
            <Box
              sx={{
                width: 300,
                height: 300,
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            >
              <Image
                src={resident.image.startsWith('http') ? resident.image : `http://${window.location.hostname}:5001${resident.image}`}
                alt={resident.fullname}
                width={300}
                height={300}
                fit="cover"
                onError={(e) => {
                  console.error('Image failed to load:', e);
                  e.target.src = defaultImage;
                }}
              />
            </Box>
          </Center>
        )}
        <Title order={2} align="center" mb="xl" style={{ color: '#1B5E20' }}>{resident.fullname}</Title>
        <Box p="md" style={{ backgroundColor: 'rgba(46, 125, 50, 0.1)', borderRadius: 8 }}>
          <Text mb="md" size="lg"><b>Address:</b> {resident.address}</Text>
          <Text mb="md" size="lg"><b>Birthdate:</b> {new Date(resident.birthdate).toLocaleDateString()}</Text>
          <Text mb="md" size="lg"><b>Sex:</b> {resident.sex}</Text>
          <Text mb="md" size="lg"><b>Civil Status:</b> {resident.civilstatus}</Text>
          <Text mb="md" size="lg"><b>Citizenship:</b> {resident.citizenship}</Text>
          <Text mb="md" size="lg"><b>Voter Status:</b> {resident.registervoter ? 'Registered Voter' : 'Not Registered'}</Text>
          <Text mb="md" size="lg"><b>PWD:</b> {resident.PWD ? 'Yes' : 'No'}</Text>
          <Text mb="md" size="lg"><b>4Ps Member:</b> {resident.fourpsmember ? 'Yes' : 'No'}</Text>
        </Box>
      </Paper>
    </Box>
  );
};

export default ResidentPublicView; 