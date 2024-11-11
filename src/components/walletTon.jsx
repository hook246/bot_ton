import {
  Box,
  Link,
  Typography
} from "@mui/material";
import { TonConnectButton, TonConnectUIProvider, THEME} from '@tonconnect/ui-react';

export default function Ton() {
  return (
    <Box sx={{ bgcolor: "background.paper", p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        Demo
      </Typography>
      <Typography
        variant="subtitle1"
        align="center"
        color="text.secondary"
        component="p"
      >
        <span>My App with React UI</span>
        {/* <TonConnectButton /> */}
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        {"Copyright © "}
        <Link color="inherit" href="https://solanazh.com/">
          SolanaZH 
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    </Box>
  );
}
