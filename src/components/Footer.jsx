import { Box, Typography, Grid } from '@mui/material';
import CoursifyLogo from '../assets/Coursify-logo.png'; 

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#111827', color: '#fff', mt: 8, pt: 6, pb: 3 }}>
      <Grid
        container
        spacing={4}
        alignItems="flex-start"
        justifyContent="space-between"
        px={{ xs: 3, md: 10 }}
      >
        {/* Left: Logo + LMS Summary */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <img src={CoursifyLogo} alt="Coursify Logo" width={40} height={40} />
            <Typography variant="h6" fontWeight="bold">Coursify</Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              lineHeight: 1.6,
              maxWidth: 400
            }}
          >
            -Coursify is a powerful and user-friendly learning platform designed to help students grow,<br />
            -track progress, and achieve their goals through intuitive course experiences.<br />
            
          </Typography>
        </Grid>

        {/* Centered: Contact Us */}
        <Grid item xs={12} md={5} textAlign="center">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2">✉️ coursify.support@example.com</Typography>
          <Typography variant="body2">📞 +962-6-123-4567</Typography>
          <Typography variant="body2">📍 Amman, Jordan</Typography>
        </Grid>
      </Grid>

      {/* Divider */}
      <Box sx={{ mt: 5, borderTop: '1px solid #333', pt: 2, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#fff' }}>
          © 2025 Coursify Learning Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
