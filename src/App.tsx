import { Box } from "@mui/material";
import { FileUpload } from "@components/FileUpload/FileUpload";

const App = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <FileUpload variant="input" allowedExtensions={[".pdf"]} multiple />
    </Box>
  );
};

export default App;
