import { Box, Typography, Grid } from '@mui/material';
import CoursifyLogo from '../assets/Coursify-logo.png';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: '#111827', color: '#fff', mt: 6, pt: 4, pb: 2 }}>
      <Grid
        container
        spacing={3}
        alignItems="flex-start"
        justifyContent="space-between"
        px={{ xs: 2, md: 8 }}
      >
        {/* Left Section: Logo and Description */}
        <Grid item xs={12} md={5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <img src={CoursifyLogo} alt="Coursify Logo" width={36} height={36} />
            <Typography variant="h6" fontWeight="bold">Coursify</Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              mt: 0.5,
              lineHeight: 1.5,
              maxWidth: 360,
            }}
          >
            Coursify is a powerful and user-friendly platform designed to help students grow, track progress, and achieve their goals through intuitive course experiences.
          </Typography>
        </Grid>

        {/* Right Section: Contact Info */}
        <Grid item xs={12} md={5} textAlign="center">
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Contact Us
          </Typography>
          <Typography variant="body2">✉️ ayham.9899@outlook.com</Typography>
          <Typography variant="body2">📞 +962-788128334</Typography>
          <Typography variant="body2">📍 Amman, Jordan</Typography>
        </Grid>
      </Grid>

      {/* Bottom Divider */}
      <Box sx={{ mt: 3, borderTop: '1px solid #333', pt: 1.5, textAlign: 'center' }}>
        <Typography variant="caption" sx={{ color: '#fff' }}>
          © 2025 Coursify Learning Platform. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
