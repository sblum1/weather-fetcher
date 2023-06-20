import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from "@mui/material";

// Maps out forecast data into a table 
export const ForecastTable = ({ forecastData }) => {
  return (
    <>
        {forecastData !== null ? 
            (
                <TableContainer component={Paper} sx={{maxWidth: {xs: "100%", sm: "50%" }, marginRight: { xs: 0, sm: 5 } }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: "bold", fontSize: { xs: "15px", sm: "17px" } }}>Day</TableCell>
                                <TableCell align="left" sx={{ fontWeight: "bold", fontSize: { xs: "15px", sm: "17px" } }}>Weather</TableCell>
                                <TableCell align="left" sx={{ fontWeight: "bold", fontSize: { xs: "15px", sm: "17px" } }}>High</TableCell>
                                <TableCell align="left" sx={{ fontWeight: "bold", fontSize: { xs: "15px", sm: "17px" } }}>Low</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {forecastData.map((forecast) => (
                                <TableRow
                                    key={forecast.date}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row" sx={{ fontSize: { xs: "15px", sm: "17px" } }}>
                                        {forecast.weekday}
                                    </TableCell>
                                    <TableCell align="left" sx={{ fontSize: { xs: "15px", sm: "17px" } }}>
                                        <Box display="flex" alignItems={"center"}>
                                        <img src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`} height="35px"  />
                                            {forecast.avgTemp}° F
                                        </Box>
                                    </TableCell>

                                    <TableCell align="left" sx={{ fontSize: { xs: "15px", sm: "17px" } }}>
                                        {forecast.maxTemp}° F
                                    </TableCell>

                                    <TableCell align="left" sx={{ fontSize: { xs: "15px", sm: "17px" } }}>
                                        {forecast.minTemp}° F
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )
            :
            (<></>)
        }    
    </>
  )
}