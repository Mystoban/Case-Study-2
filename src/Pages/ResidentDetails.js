import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Paper, Loader, Title, Text } from "@mantine/core";
import axios from "axios";

const ResidentDetails = () => {
  const { id } = useParams();
  const [resident, setResident] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace with your actual API endpoint
    axios.get(`/api/residents/${id}`)
      .then(res => {
        setResident(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!resident) return <Text color="red">Resident not found.</Text>;

  return (
    <Paper p="md" shadow="sm">
      <Title order={2}>{resident.lastname}, {resident.firstname}</Title>
      <Text>Address: {resident.address}</Text>
      <Text>Birthdate: {resident.birthdate}</Text>
      <Text>Sex: {resident.sex}</Text>
      <Text>Civil Status: {resident.civilstatus}</Text>
      {/* Add more fields as needed */}
    </Paper>
  );
};

export default ResidentDetails; 