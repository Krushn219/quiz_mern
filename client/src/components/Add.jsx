import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../theme";

const Add = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    return (
        <Box mb="30px">
            {/* <ins className="adsbygoogle"
                style={{display:"block", backgroundColor:"white"}}
                data-ad-client="ca-pub-1926829365783201"
                data-ad-slot="2982169444"
                data-ad-format="auto"
                data-full-width-responsive="true"></ins> */}
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '5px' }}>
                <div style={{ flex: 4 , textAlign:"center"}}>
                    {/* Your content or text goes here */}
                    <p>Adds by Google...</p>
                    <Button variant="contained" color="primary" sx={{
                            fontSize: "16px",
                            backgroundColor: '#007bff',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#0056b3',
                            },
                        }}>
                            Google adds
                        </Button>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                    <p>Your text goes here...</p>
                </div>
                <div style={{ flex: 2 }}>
                    {/* AdSense code here */}
                    <ins
                        className="adsbygoogle"
                        style={{ display: 'block' }}
                        data-ad-client="ca-pub-1926829365783201"
                        data-ad-slot="2982169444"
                        data-ad-format="auto"
                        data-full-width-responsive="true"
                    ></ins>
                </div>
            </div>
        </Box>
    );
};

export default Add;
