import React, { useRef } from "react";
import { Modal, Button, Group, Text } from "@mantine/core";
import { QRCodeCanvas } from "qrcode.react";

const QRCodeModal = ({ opened, onClose, value, label = "Resident QR Code" }) => {
  const qrRef = useRef();

  // Download QR as PNG
  const handleDownload = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <Modal opened={opened} onClose={onClose} title={label} centered>
      <Group position="center" ref={qrRef}>
        <QRCodeCanvas
          value={value}
          size={220}
          bgColor="#fff"
          fgColor="#222"
          level="H"
          includeMargin
        />
      </Group>
      <Group position="center" mt="md">
        <Button onClick={handleDownload} color="teal">
          Download QR Code
        </Button>
      </Group>
      <Text align="center" size="sm" mt="md" color="dimmed">
        Scan this QR code to view resident details.
      </Text>
    </Modal>
  );
};

export default QRCodeModal; 